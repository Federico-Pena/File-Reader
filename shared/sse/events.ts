export type SSEInfoEvent = {
  type: 'info'
  totalPages: number
  filename: string
  initPage: number
  endPage: number
}

export type SSEQueueEvent = {
  type: 'queue'
  status: 'waiting' | 'started'
  position?: number
}

export type SSEPageEvent = {
  type: 'page'
  pageNumber: number
  text: string
  progress: number
  extension: string
}

export type SSEErrorEvent = {
  type: 'error'
  pageNumber?: number
  error: string
}

export type SSECompleteEvent = {
  type: 'complete'
  message: string
}

export type SSEEvent =
  | SSEInfoEvent
  | SSEQueueEvent
  | SSEPageEvent
  | SSEErrorEvent
  | SSECompleteEvent
