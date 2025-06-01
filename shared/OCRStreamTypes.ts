export type EventsNames = 'data' | 'done' | 'errorEvent' | 'errorReached' | 'queued'

export interface OCREventData {
  text: string
  page: number
}

export interface QueuedEventData {
  position: number
}

export interface ErrorEventData {
  message: string
}

export interface DoneEventData {
  message: string
}
export interface TotalPagesEventData {
  total_pages: number
}

export type OCRStreamEventPayload =
  | { eventName: 'data'; data: OCREventData }
  | { eventName: 'errorEvent'; data: ErrorEventData }
  | { eventName: 'done'; data: DoneEventData }
  | { eventName: 'queued'; data: QueuedEventData }
  | { eventName: 'errorReached'; data: null }
  | { eventName: 'total_pages'; data: { total_pages: number } }

export type OcrTextStorage = {
  [filename: string]: {
    [page: number]: string
  }
}
