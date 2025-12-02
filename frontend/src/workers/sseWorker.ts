let controller: AbortController | null = null

self.addEventListener('message', async (ev: MessageEvent<WorkerIncomingMsg>) => {
  const msg = ev.data
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
      const errorMsg: WorkerOutgoingMsg = { type: 'error', error: `HTTP ${res.status}` }
      self.postMessage(errorMsg)
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
            const msgOut: WorkerOutgoingMsg = { type: 'sse', data }
            self.postMessage(msgOut)
          } catch (err) {
            const parseErr: WorkerOutgoingMsg = {
              type: 'parse-error',
              error: String(err),
              raw: line
            }
            self.postMessage(parseErr)
          }
        }
      }
    }
    const doneMsg: WorkerOutgoingMsg = { type: 'done' }
    self.postMessage(doneMsg)
  } catch (err) {
    if ((err as any)?.name === 'AbortError') {
      const abortedMsg: WorkerOutgoingMsg = { type: 'aborted' }
      self.postMessage(abortedMsg)
    } else {
      const errorMsg: WorkerOutgoingMsg = { type: 'error', error: String(err) }
      self.postMessage(errorMsg)
    }
  } finally {
    controller = null
  }
})
