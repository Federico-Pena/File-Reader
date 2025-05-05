import { tmpdir } from 'node:os'
import { join } from 'node:path'

const ACCEPTED_MIME_TYPES = ['pdf', 'docx', 'txt', 'md']
const API_PROTOCOL = process.env.NODE_ENV === 'development' ? 'http' : 'https'
const API_HOST = process.env.NODE_ENV === 'development' ? 'localhost' : 'file-reader-1.onrender.com'
const PORT = process.env.PORT ?? 1234
const API_BASE_URL = `${API_PROTOCOL}://${API_HOST}${
  process.env.NODE_ENV === 'development' && `:${PORT}`
}`
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
