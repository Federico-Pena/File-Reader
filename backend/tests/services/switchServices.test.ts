import path from 'node:path'
import fs from 'node:fs'
import { describe, test, expect } from 'vitest'
import { switchServices } from '../../src/services/switchServices'
import { txtProcessor } from '../../src/services/txtProcessor'
import { apiConfig } from '../../src/config/apiConfig'
import supertest from 'supertest'
import app from '../../src/app/app'

const apiUrl = apiConfig.API_ROUTES.uploadFile.uploadFile

const includesText = (arrayText: string[], text: string) => {
  const textContains = arrayText.some((t) => t.includes(text))
  return textContains
}
describe('switchServices', () => {
  const buffer = Buffer.from('dummy content')

  test('should correctly extract text from TXT file', async () => {
    const filePath = path.join(__dirname, '../testFiles/sample.txt')
    const fileBuffer = fs.readFileSync(filePath)
    const { statusCode, body } = await supertest(app)
      .post(apiUrl)
      .attach('file', fileBuffer, 'sample.txt')
      .set('Content-Type', 'multipart/form-data')
      .expect(200)

    expect(statusCode).toBe(200)
    expect(body).toHaveProperty('data')
    const textContains = body.data.some((page: { text: string; index: number }) =>
      page.text.includes('The names "John Doe" for males, "Jane Doe" or "Jane Roe" for females')
    )
    expect(textContains).toBe(true)
  })
  test('should correctly extract text from DOCX file', async () => {
    const filePath = path.join(__dirname, '../testFiles/sample.docx')
    const fileBuffer = fs.readFileSync(filePath)
    const { statusCode, body } = await supertest(app)
      .post(apiUrl)
      .attach('file', fileBuffer, 'sample.docx')
      .set('Content-Type', 'multipart/form-data')
      .expect(200)

    expect(statusCode).toBe(200)
    expect(body).toHaveProperty('data')
    const textContains = body.data.some((page: { text: string; index: number }) =>
      page.text.includes(
        'Vestibulum neque massa, scelerisque sit amet ligula eu, congue molestie mi.'
      )
    )
    expect(textContains).toBe(true)
  })

  test('should correctly extract text from PDF file', async () => {
    const filePath = path.join(__dirname, '../testFiles/sample.pdf')
    const fileBuffer = fs.readFileSync(filePath)
    const { statusCode, body } = await supertest(app)
      .post(apiUrl)
      .attach('file', fileBuffer, 'sample.pdf')
      .set('Content-Type', 'multipart/form-data')
      .expect(200)

    expect(statusCode).toBe(200)
    expect(body).toHaveProperty('data')
    const textContains = body.data.some((page: { text: string; index: number }) =>
      page.text.includes('Maecenas mauris lectus, lobortis et purus mattis, blandit dictum tellus.')
    )
    expect(textContains).toBe(true)
  })

  test('should correctly extract text from Markdown file', async () => {
    const filePath = path.join(__dirname, '../testFiles/sample.md')
    const fileBuffer = fs.readFileSync(filePath)
    const { statusCode, body } = await supertest(app)
      .post(apiUrl)
      .attach('file', fileBuffer, 'sample.md')
      .set('Content-Type', 'multipart/form-data')
      .expect(200)

    expect(statusCode).toBe(200)
    expect(body).toHaveProperty('data')
    const textContains = body.data.some((page: { text: string; index: number }) =>
      page.text.includes('Título de prueba')
    )
    expect(textContains).toBe(true)
  })
})
