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

// Parse incoming JSON data.
app.use(express.json())

// Enable CORS
app.use(cors(apiConfig.CORS_SETTINGS))

// Log HTTP requests format.
app.use(logger)

// Serve static files.
console.log(`Current directory: ${path.join(__dirname, '/public')}`)

const staticPath = path.join(__dirname, '/public')
app.use('/', express.static(staticPath))

// Use one router
app.use(fileReader)

// Handle all other requests.
app.use('*', (req, res) => {
  res.sendFile(path.join(staticPath, '/index.html'))
})

export default app
