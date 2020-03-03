import 'dotenv/config';

import excelJS from 'exceljs';
import { resolve } from 'path';

import AddressSearch from '../models/AddressSearch';
import Excel from '../models/Excel';

class AddressController {
  async store(req, res) {
    const workbook = new excelJS.Workbook();
    const file = await Excel.findOne();
    let quantity = 0;

    const filePath = `${resolve(
      __dirname,
      '..',
      '..',
      '..',
      'tmp',
      'uploads',
      file.path
    )}`;

    await AddressSearch.deleteMany({});

    await workbook.xlsx.readFile(filePath).then(function() {
      workbook.getWorksheet(1).eachRow(data => {
        if (data.values[1] !== 'Full+Address') {
          AddressSearch.create({
            searchGeo: data.values[1],
          });
        }
      });
    });

    await workbook.xlsx.readFile(filePath).then(function() {
      workbook.getWorksheet(1).eachRow(data => {
        if (data.values[1] !== 'Full+Address') {
          quantity += 1;
        }
      });
    });

    return res.status(200).json({
      success: quantity,
    });
  }
}

export default new AddressController();
