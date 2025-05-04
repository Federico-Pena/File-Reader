import { Router } from 'express'
import getMimeTypes from '../controllers/getMimeTypes.js'
import { multerMemoryStorage } from '../middlewares/multerMemoryStorage.js'
import fileUploadController from '../controllers/fileUploadController.js'
import { apiConfig } from '../config/apiConfig.js'
import { queueMiddleware } from '../middlewares/queueMiddleware.js'
import { streamController } from '../controllers/streamController.js'

const fileReader = Router()

const { uploadFile, getMimeTypes: getMimeTypesRoute, streamingFile } = apiConfig.API_ROUTES

fileReader.get(getMimeTypesRoute, getMimeTypes)
fileReader.post(uploadFile, multerMemoryStorage, fileUploadController)
fileReader.get(streamingFile, queueMiddleware, streamController)

export default fileReader
