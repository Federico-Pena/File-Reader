import supertest from 'supertest'
import { afterAll, describe, expect, test, vi } from 'vitest'
import app from '../../src/app/app.js'
import { apiConfig } from '../../src/config/apiConfig.js'
import { colors } from '../../src/middlewares/logger.js'

const apiUrl = apiConfig.API_ROUTES.getMimeTypes

describe('Logger Middleware', () => {
  const logSpy = vi.spyOn(console, 'log')

  test('should log request details to the console', async () => {
    const { statusCode }: { statusCode: number } = await supertest(app).get(apiUrl).expect(200)
    const date = new Date()
    const methodColor = colors.blue
    const statusCodeColor = colors.green
    const consoleMessage = `${date.toLocaleDateString()} ${date.toLocaleTimeString()} --> ${methodColor}GET${
      colors.reset
    } ${statusCodeColor}${statusCode}${colors.reset} ${apiUrl}`

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(consoleMessage))
  })

  afterAll(() => {
    logSpy.mockRestore()
  })
})
