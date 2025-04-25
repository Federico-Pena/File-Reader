import type { Request, Response } from 'express'
import { apiConfig } from '../config/apiConfig.js'
import { extractTextWithPython } from '../services/extractTextWithPython.js'
import { parseTextToRichBlocks } from '../utils/normalizeText.js'

const fileUploadController = async (req: Request, res: Response) => {
  try {
    if (!req.file || !req.file?.buffer) {
      res.status(400).json({ error: "Can't find file" })
      return
    }
    const fileExt = req.file.originalname.split('.').pop()?.toLowerCase() || ''
    const mimeTypes = apiConfig.ACCEPTED_MIME_TYPES

    if (!mimeTypes.includes(fileExt)) {
      const clientMimeTypes = mimeTypes.map((type) => `"${type}"`).join(', ')
      const msg = `Formats allowed are: ${clientMimeTypes}.`
      res.status(400).json({ error: msg })
      return
    }

    const pages = await extractTextWithPython(req.file.buffer, fileExt)
    const pagesWithRichText = pages.map((page) => {
      const { withLineBreaks, cleaned } = parseTextToRichBlocks(page.text)
      return {
        ...page,
        withLineBreaks,
        cleaned
      }
    })
    res.status(200).json({ data: pagesWithRichText })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export default fileUploadController
