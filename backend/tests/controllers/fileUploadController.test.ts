import fs from 'node:fs'
import path from 'node:path'
import supertest from 'supertest'
import { describe, test, expect, vi } from 'vitest'
import { apiConfig } from '../../src/config/apiConfig'
import app from '../../src/app/app'

const apiUrl = apiConfig.API_ROUTES.uploadFile
const mimeTypes = apiConfig.ACCEPTED_MIME_TYPES

describe('fileUploadController Controller', () => {
  const mockFile = (originalname: string, mimetype: string, buffer: Buffer) => ({
    fieldname: 'file',
    originalname,
    mimetype,
    buffer,
    size: buffer.length,
    encoding: '7bit'
  })

  test('should return 400 if no file is uploaded', async () => {
    const { statusCode, body } = await supertest(app).post(apiUrl).expect(400)
    expect(statusCode).toBe(400)
    expect(body.error).toBe("Can't find file")
  })

  test('should return 400 for unsupported file type', async () => {
    const file = mockFile('testfile.png', 'image/png', Buffer.from('dummy content'))
    const { statusCode, body } = await supertest(app)
      .post(apiUrl)
      .attach('file', file.buffer, file.originalname)
      .expect(400)

    expect(statusCode).toBe(400)
    const clientMimeTypes = Object.values(mimeTypes)
      .map((type) => `"${type}"`)
      .join(', ')
    const msg = `Formats allowed are: ${clientMimeTypes}.`
    expect(body.error).toBe(msg)
  })
})
