import type { Request, Response } from 'express'
import { apiConfig } from '../config/apiConfig.js'

const getMimeTypes = async (req: Request, res: Response) => {
  try {
    const clientMimeTypes = Object.values(apiConfig.ACCEPTED_MIME_TYPES).map((type) => type.client)
    res.status(200).json({
      data: clientMimeTypes
    })
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error'
    })
  }
}

export default getMimeTypes
