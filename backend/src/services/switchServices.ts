import { apiConfig } from '../config/apiConfig.js'
import { docxProcessor } from './docxProccesor.js'
import { mdProcessor } from './mdProcessor.js'
import { extractTextWithPython } from './textExtractorService.js'
import { txtProcessor } from './txtProcessor.js'

export const CHUNK_SIZE = 5000

export const splitText = (text: string, chunkSize: number): string[] => {
  return text.match(new RegExp(`.{1,${chunkSize}}`, 'gs')) || []
}

const switchServices = async (
  mimetype: string,
  dataBuffer: Buffer,
  sendPage: (data: Data[]) => void
) => {
  switch (mimetype) {
    case apiConfig.ACCEPTED_MIME_TYPES.docx.client:
      await docxProcessor(dataBuffer, sendPage)
      break
    case apiConfig.ACCEPTED_MIME_TYPES.pdf.client:
      await extractTextWithPython(dataBuffer, mimetype, sendPage)
      break
    case apiConfig.ACCEPTED_MIME_TYPES.md.client:
      await mdProcessor(dataBuffer, sendPage)
      break
    case apiConfig.ACCEPTED_MIME_TYPES.txt.client:
      await txtProcessor(dataBuffer, sendPage)
      break
    default:
      throw new Error('Tipo de archivo no soportado.')
  }
}

export { switchServices }
