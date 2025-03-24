import { normalizeText } from './normalizeText.js'
import { CHUNK_SIZE, splitText } from './switchServices.js'

export const txtProcessor = async (
  txtBuffer: Buffer,
  sendPage: (data: Data[]) => void
): Promise<void> => {
  try {
    const text = txtBuffer.toString('utf-8').trim()
    if (text.length === 0) {
      throw new Error('El archivo TXT está vacío o no se pudo extraer el texto.')
    }
    const pages = splitText(text, CHUNK_SIZE)
    const data = pages.map((page, i) => ({ text: page, page: i }))
    sendPage(data)
  } catch (error: any) {
    throw new Error('Error procesando el archivo TXT.')
  }
}
