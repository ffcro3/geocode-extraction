import 'dotenv/config';

import Excel from '../models/Excel';

class ExcelController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    await Excel.deleteMany({});

    try {
      const file = await Excel.create({
        name,
        path,
        date: new Date(),
      });

      return res.status(200).json(file);
    } catch (err) {
      return res.status(400).json({
        Error: err,
      });
    }
  }
}

export default new ExcelController();
