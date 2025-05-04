import { tmpdir } from 'node:os'
import { join } from 'node:path'

const ACCEPTED_MIME_TYPES = ['pdf', 'docx', 'txt', 'md']
const API_URL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:${process.env.PORT ?? 1234}`
    : 'https://file-reader-1.onrender.com'
const CORS_SETTINGS = {
  origin: [API_URL, 'http://localhost:5173', 'http://localhost:1234'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Control-Allow-Credentials']
}
const API_ROUTES = {
  uploadFile: '/api/v1/upload-file',
  getMimeTypes: '/api/v1/get-mime-types',
  streamingFile: '/api/v1/streaming-file'
}
const PORT = process.env.PORT ?? 1234
const PATH_DIR_TEMP_FILES = join(tmpdir(), 'queueFiles') ?? '/tmp/queueFiles'

export const apiConfig = {
  API_URL,
  PORT: PORT,
  API_ROUTES,
  CORS_SETTINGS,
  ACCEPTED_MIME_TYPES,
  PATH_DIR_TEMP_FILES
}
