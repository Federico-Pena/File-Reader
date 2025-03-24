import supertest from 'supertest'
import { describe, expect, test } from 'vitest'
import { apiConfig } from '../../src/config/apiConfig'
import app from '../../src/app/app'
const apiUrl = apiConfig.API_ROUTES.uploadFile.getMimeTypes
const mimeTypes = Object.keys(apiConfig.ACCEPTED_MIME_TYPES).map(
  (key) => apiConfig.ACCEPTED_MIME_TYPES[key].client
)

describe('getMimeTypes Controller', () => {
  test('should return a list of accepted mime types', async () => {
    const { body: response } = await supertest(app).get(apiUrl).expect(200)
    expect(response).toEqual({
      data: mimeTypes
    })
  })
})
