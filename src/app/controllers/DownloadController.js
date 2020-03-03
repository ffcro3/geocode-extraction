import 'dotenv/config';
import xlsx from 'mongo-xlsx';
import glob from 'glob';
import move from 'move-file';
import { resolve } from 'path';

import GeoCode from '../models/GeoCode';

class DownloadController {
  async convert(req, res) {
    const data = await GeoCode.find();

    const compressedPath = `${resolve(
      __dirname,
      '..',
      '..',
      '..',
      'tmp',
      'extract'
    )}`;

    const rootPath = `${resolve(__dirname, '..', '..', '..')}`;

    const model = await xlsx.buildDynamicModel(data);
    await xlsx.mongoData2Xlsx(data, model, function(err, data) {});

    return res.json({
      success: 'exported',
    });
  }

  async download(req, res) {
    const compressedPath = `${resolve(
      __dirname,
      '..',
      '..',
      '..',
      'tmp',
      'extract'
    )}`;
    const rootPath = `${resolve(__dirname, '..', '..', '..')}`;

    await glob(`${rootPath}/*.xlsx`, {}, (err, files) => {
      files.forEach(file => {
        move(file, `${compressedPath}/Address.xlsx`);
      });
    });

    return res.status(200).download(`${compressedPath}/Address.xlsx`);
  }
}

export default new DownloadController();
