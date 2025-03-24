import { Router } from "express";
import getMimeTypes from "../controllers/getMimeTypes.js";
import { multerMemoryStorage } from "../middlewares/multerMemoryStorage.js";
import fileUploadController from "../controllers/fileUploadController.js";
import { apiConfig } from "../config/apiConfig.js";
const fileReader = Router();
const { uploadFile, getMimeTypes: getMimeTypesRoute } = apiConfig.API_ROUTES.uploadFile;
fileReader.get(getMimeTypesRoute, getMimeTypes);
fileReader.post(uploadFile, multerMemoryStorage, fileUploadController);
var fileReader_routes_default = fileReader;
export {
  fileReader_routes_default as default
};
