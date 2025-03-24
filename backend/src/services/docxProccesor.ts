import mammoth from 'mammoth'
import { CHUNK_SIZE, splitText } from './switchServices.js'

export const docxProcessor = async (docxBuffer: Buffer, sendPage: (data: Data[]) => void) => {
  try {
    const { value: text } = await mammoth.extractRawText({ buffer: docxBuffer })
    if (text.trim().length === 0) {
      throw new Error('El archivo DOCX está vacío o no se pudo extraer el texto.')
    }
    const pages = splitText(text, CHUNK_SIZE)
    const data = pages.map((page, i) => ({ text: page, page: i }))
    sendPage(data)
  } catch (error: any) {
    console.error('Error procesando DOCX:', error.message)
    throw new Error('Error procesando el archivo DOCX.')
  }
}
