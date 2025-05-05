import { tmpdir } from 'node:os'
import { join } from 'node:path'

const isDev = process.env.NODE_ENV === 'development'
const ACCEPTED_MIME_TYPES = ['pdf', 'docx', 'txt', 'md']
const PORT = process.env.PORT ?? 1234
const API_BASE_URL = isDev ? `http://localhost:${PORT}` : `https://file-reader.onrender.com`
const CORS_SETTINGS = {
  origin: [API_BASE_URL, 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Control-Allow-Credentials']
}
const API_ROUTES = {
  uploadFile: '/api/v1/upload-file',
  getMimeTypes: '/api/v1/get-mime-types',
  streamingFile: '/api/v1/streaming-file'
}
const PATH_DIR_TEMP_FILES = join(tmpdir(), 'queueFiles') ?? '/tmp/queueFiles'

export const apiConfig = {
  API_BASE_URL,
  PORT: PORT,
  API_ROUTES,
  CORS_SETTINGS,
  ACCEPTED_MIME_TYPES,
  PATH_DIR_TEMP_FILES
}
