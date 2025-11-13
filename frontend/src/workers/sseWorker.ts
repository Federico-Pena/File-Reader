import { tokenizeBlocks } from '@/textParser/tokenizeBlocks'
import type { SSEEvent } from '@shared/sse/events'

type StartMsg = {
  type: 'start'
  file: File
  lang: string
  initPage: string
  endPage: string
  postUrl: string
}

type StopMsg = { type: 'stop' }

let controller: AbortController | null = null

self.addEventListener('message', async (ev: MessageEvent) => {
  const msg = ev.data as StartMsg | StopMsg
  if (msg.type === 'stop') {
    controller?.abort()
    return
  }
  if (msg.type !== 'start') return

  controller = new AbortController()
  try {
    const form = new FormData()
    form.append('file', msg.file)
    form.append('lang', msg.lang)
    form.append('initPage', msg.initPage)
    form.append('endPage', msg.endPage)

    const res = await fetch(msg.postUrl, {
      method: 'POST',
      body: form,
      signal: controller.signal
    })
    if (!res.ok || !res.body) {
      self.postMessage({ type: 'error', error: `HTTP ${res.status}` })
      return
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        if (!line) continue
        if (line.startsWith('data: ')) {
          try {
            const data: SSEEvent = JSON.parse(line.replace('data: ', ''))
            if (data.type === 'page') {
              self.postMessage({ type: 'sse', data })
            } else {
              self.postMessage({ type: 'sse', data })
            }
          } catch (err) {
            // comunicar parsing error
            self.postMessage({
              type: 'parse-error',
              error: String(err),
              raw: line
            })
          }
        }
      }
    }
    self.postMessage({ type: 'done' })
  } catch (err) {
    if ((err as any)?.name === 'AbortError') {
      self.postMessage({ type: 'aborted' })
    } else {
      self.postMessage({ type: 'error', error: String(err) })
    }
  } finally {
    controller = null
  }
})
