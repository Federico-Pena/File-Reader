interface RichBlock {
  type: 'title' | 'subtitle' | 'paragraph' | 'list' | 'blockquote'
  inlineTokens: InlineToken[]
}
type InlineToken =
  | { type: 'text'; text: string }
  | { type: 'link'; href: string; text: string }
  | { type: 'email'; email: string; text: string }
  | { type: 'quote'; text: string }
  | { type: 'emphasis'; text: string }
  | { type: 'strong'; text: string }
  | { type: 'code'; text: string }
  | { type: 'math'; text: string }
  | { type: 'citation'; ref: string; text: string }
  | { type: 'footnote'; ref: string; text: string }
  | { type: 'date'; text: string }
  | { type: 'number'; text: string }
  | { type: 'currency'; text: string }
  | {
      type: 'list'
      text: string
      listType: 'bullet' | 'numbered' | 'lettered' | 'roman' | 'indexLine'
      listIndicator: string
    }

type ListType = 'bullet' | 'numbered' | 'lettered' | 'roman' | 'indexLine'

// SSE

type SSEInfoEvent = {
  type: 'info'
  totalPages: number
  filename: string
  initPage: number
  endPage: number
}

type SSEQueueEvent = {
  type: 'queue'
  status: 'waiting' | 'started'
  position?: number
}

type SSEPageEvent = {
  type: 'page'
  page: number
  forSpeech: string
  forRender: RichBlock[]
  progress: number
  extension: string
}

type SSEErrorEvent = {
  type: 'error'
  pageNumber?: number
  error: string
}

type SSECompleteEvent = {
  type: 'complete'
  message: string
}

type SSEEvent = SSEInfoEvent | SSEQueueEvent | SSEPageEvent | SSEErrorEvent | SSECompleteEvent
