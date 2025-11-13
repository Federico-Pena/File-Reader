import type { SSEEvent } from '@shared/sse/events'
import type { Response } from 'express'
export class SseEmitter {
  res: Response
  closed = false
  constructor(res: Response) {
    this.res = res
  }
  init(headers: Record<string, string> = {}) {
    // Cabeceras SSE recomendadas (proxy-friendly)
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'X-Accel-Buffering': 'no'
    }
    this.res.writeHead(200, { ...defaultHeaders, ...headers })
    // Garantiza que los headers salgan al cliente de inmediato
    if (typeof (this.res as any).flushHeaders === 'function') {
      ;(this.res as any).flushHeaders()
    }
  }
  send(event: SSEEvent) {
    if (this.closed) return
    try {
      this.res.write(`data: ${JSON.stringify(event)}\n\n`)
    } catch (err) {
      console.warn('SSE write failed, marking closed', (err as Error).message)
      this.closed = true
    }
  }
  end() {
    if (this.closed) return
    try {
      this.res.end()
    } catch (err) {
      // ignore
    } finally {
      this.closed = true
    }
  }
}
