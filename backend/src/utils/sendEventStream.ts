import type { Response } from 'express'
import type { OCRStreamEventPayload } from '@shared/OCRStreamTypes'

export function sendEventStream<T extends OCRStreamEventPayload>(
  res: Response,
  { eventName, data }: T
) {
  res.write(`event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`)
}
