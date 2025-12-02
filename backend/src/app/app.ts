import path from 'node:path'
import express from 'express'
import cors from 'cors'
import { apiConfig } from '../config/apiConfig.js'
import { logger } from '../middlewares/logger.js'
import fileReader from '../routes/fileReader.routes.js'
import { cwd } from 'node:process'

const app = express()

// Disable the header 'X-Powered-By'
app.disable('x-powered-by')

app.use(express.json())

app.use(cors(apiConfig.CORS_SETTINGS))

app.use(logger)

const staticPath = path.join(cwd(), 'dist', 'public')

app.use('/', express.static(staticPath))

app.use(fileReader)

// Handle all other requests.
app.use(express.static(staticPath))

export default app
