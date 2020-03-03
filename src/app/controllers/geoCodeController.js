import 'dotenv/config';
import delay from 'delay';

import AddressSearch from '../models/AddressSearch';
import GeoCode from '../models/GeoCode';

import mapsApi from '../services/maps';

class GeoCodeController {
  async store(req, res) {
    try {
      await GeoCode.deleteMany({});
      const data = await AddressSearch.find();

      await data.forEach(async (item, index) => {
        mapsApi.geocode(
          {
            address: item.searchGeo,
          },
          function(err, response) {
            if (err === 'OVER_QUERY_LIMIT') {
              delay(10000);
              console.log('Delayed 10 seconds... continue');
            }
            if (err) {
              console.log(err);
            }
            if (!err) {
              GeoCode.create({
                number:
                  response.json.results[0].address_components[0].long_name,
                route: response.json.results[0].address_components[1].long_name,
                neighborhood:
                  response.json.results[0].address_components[2].long_name,
                city: response.json.results[0].address_components[3].long_name,
                state: response.json.results[0].address_components[4].long_name,
                country:
                  response.json.results[0].address_components[5].long_name,
                formattedAddress: response.json.results[0].formatted_address,
                latitude: response.json.results[0].geometry.location.lat,
                longitude: response.json.results[0].geometry.location.lng,
                place_id: response.json.results[0].place_id,
                type: response.json.results[0].types[0],
              });
            }
          }
        );
      });

      return res.status(200).json({
        success: 'Successfully Created',
      });
    } catch (err) {
      return res.status(400).json({
        error: err,
      });
    }
  }

  async show(req, res) {
    const { page } = req.query;
    const data = await GeoCode.find()
      .skip(page * 25)
      .sort({
        route: 1,
      })
      .limit(25);

    return res.status(200).json(data);
  }

  async countPages(req, res) {
    const data = await GeoCode.countDocuments();

    const pages = Math.ceil(data / 25);

    return res.status(200).json(pages);
  }

  async countAll(req, res) {
    const newData = await GeoCode.countDocuments();

    return res.status(200).json({
      total: newData,
    });
  }
}

export default new GeoCodeController();
