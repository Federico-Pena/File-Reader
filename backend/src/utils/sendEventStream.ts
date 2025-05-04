import type { Response } from 'express'
type EventsNames = 'queued' | 'errorReached' | 'data' | 'errorEvent' | 'done' | 'error'
export function sendEventStream(
  res: Response,
  { eventName, data }: { eventName: EventsNames; data: any }
) {
  res.write(`event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`)
}
