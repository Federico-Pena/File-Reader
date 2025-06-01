import supertest from 'supertest'
import { describe, expect, test } from 'vitest'
import { apiConfig } from '../../src/config/apiConfig'
import app from '../../src/app/app'
const apiUrl = apiConfig.API_ROUTES.getMimeTypes
const mimeTypes = apiConfig.ACCEPTED_MIME_TYPES

describe('getMimeTypes Controller', () => {
  test('should return a list of accepted mime types', async () => {
    const { body: response } = await supertest(app).get(apiUrl).expect(200)
    expect(response).toEqual({
      data: mimeTypes
    })
  })
})
