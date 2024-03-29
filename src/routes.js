import { Router } from 'express';
import multer from 'multer';
import cors from 'cors';
// CONTROLLERS

import ExcelController from './app/controllers/excelController';
import AddressController from './app/controllers/addressController';
import geoCodeController from './app/controllers/geoCodeController';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import DownloadController from './app/controllers/DownloadController';

import authMiddleware from './app/middlewares/auth';

// CONFIG

import multerConfig from './config/multer';

const routes = new Router();
routes.use(cors());
const upload = multer(multerConfig);

// SESSION
routes.post('/session', SessionController.store);
routes.post('/users', UserController.store);
routes.post('/session/verify', SessionController.verifyUser);
routes.get('/download/convert', DownloadController.convert);
routes.get('/download', DownloadController.download);

// AUTHENTICATED ROUTES
routes.use(authMiddleware);

// EXCEL

routes.post('/excelUpload', upload.single('file'), ExcelController.store);

// ADDRESS

routes.post('/addressStore', AddressController.store);
routes.get('/geocode', geoCodeController.store);
routes.get('/geocode/count', geoCodeController.countAll);
routes.get('/address', geoCodeController.show);
routes.get('/count', geoCodeController.countPages);

// USER

routes.get('/users', UserController.show);
routes.delete('/users/:id', UserController.delete);
routes.get('/users/pages', UserController.countPages);
routes.put('/users/edit/:id', UserController.editUser);

export default routes;
