import { Router } from 'express'
import getMimeTypes from '../controllers/getMimeTypes.js'
import { multerMemoryStorage } from '../middlewares/multerMemoryStorage.js'
import fileUploadController from '../controllers/fileUploadController.js'
import { apiConfig } from '../config/apiConfig.js'
import { queueMiddleware } from '../middlewares/queueMiddleware.js'

const fileReader = Router()

const { uploadFile, getMimeTypes: getMimeTypesRoute } = apiConfig.API_ROUTES

fileReader.get(getMimeTypesRoute, getMimeTypes)
fileReader.post(uploadFile, multerMemoryStorage, queueMiddleware, fileUploadController)
export default fileReader
