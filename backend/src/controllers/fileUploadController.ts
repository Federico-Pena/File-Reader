import type { Request, Response } from 'express'
import { switchServices } from '../services/switchServices.js'
import { apiConfig } from '../config/apiConfig.js'

const fileUploadController = async (req: Request, res: Response) => {
  try {
    if (!req.file || !req.file?.buffer) {
      res.status(400).json({ error: "Can't find file" })
      return
    }
    const fileExt = req.file.originalname.split('.').pop()?.toLowerCase() || ''
    const mimeTypes = Object.values(apiConfig.ACCEPTED_MIME_TYPES).map((type) => type.client)

    if (!mimeTypes.includes(fileExt)) {
      const clientMimeTypes = mimeTypes.map((type) => `"${type}"`).join(', ')
      const msg = `Formats allowed are: ${clientMimeTypes}.`
      res.status(400).json({ error: msg })
      return
    }
    const sendPage = async (data: Data[]) => {
      res.status(200).json({ data })
    }
    await switchServices(fileExt, req.file.buffer, sendPage)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export default fileUploadController
