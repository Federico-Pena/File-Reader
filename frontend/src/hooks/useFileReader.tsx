import { useEffect, useRef, useState } from 'react'
import { useUtterance } from './useUtterance'
import { toaster } from '@/components/ui/toaster'
import { UseFileDataContext } from '@/context/FileDataContext'

const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:1234/' : '/'
const POST_FILE_URL = `${BASE_URL}api/v1/upload-file`
const GET_MIME_TYPES_URL = `${BASE_URL}api/v1/get-mime-types`
const TOAST_IDS = {
  'mime-types': 'mime-types',
  'file-upload': 'file-upload',
  queue: 'queue',
  generating: 'generating'
}
export const useFileReader = () => {
  const { dispatch } = UseFileDataContext()
  const { stop } = useUtterance()
  const [clientMimeTypes, setClientMimeTypes] = useState<string[]>([])
  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(GET_MIME_TYPES_URL)
        const { data, error } = await res.json()
        if (!data || error) {
          toaster.error({
            id: 'mime-types',
            title: 'Error al obtener tipos de archivo'
          })
          return
        }
        setClientMimeTypes(data)
      } catch {
        toaster.error({
          id: 'mime-types',
          title: 'Error al obtener tipos de archivo'
        })
      }
    })()
  }, [])

  const handleFileUpload = async (file: File, lang: string, initPage: string, endPage: string) => {
    stop()
    dispatch({ type: 'CLEAN_STATE' })

    toaster.loading({
      id: TOAST_IDS['file-upload'],
      title: 'Subiendo y procesando archivo...'
    })

    if (workerRef.current) {
      workerRef.current.terminate()
      workerRef.current = null
    }

    workerRef.current = new Worker(new URL('@/workers/sseWorker.ts', import.meta.url), {
      type: 'module'
    })

    workerRef.current.postMessage({
      type: 'start',
      file,
      lang,
      initPage,
      endPage,
      postUrl: POST_FILE_URL
    } satisfies WorkerIncomingMsg)

    workerRef.current.onmessage = (evt: MessageEvent<WorkerOutgoingMsg>) => {
      const msg = evt.data
      if (msg.type === 'sse') {
        handleSSEMessage(msg.data)
      } else if (msg.type === 'done') {
        Object.keys(TOAST_IDS).forEach((id) => toaster.dismiss(id))
        toaster.success({
          title: 'Archivo procesado',
          description: 'El archivo se ha procesado correctamente.'
        })
      } else if (msg.type === 'error' || msg.type === 'parse-error') {
        console.error('sse error', msg)
        Object.keys(TOAST_IDS).forEach((id) => toaster.dismiss(id))
        toaster.error({ title: 'Error', description: 'Ocurrió un error al procesar el archivo.' })
      } else if (msg.type === 'aborted') {
        console.log('worker aborted')
        Object.keys(TOAST_IDS).forEach((id) => toaster.dismiss(id))
        toaster.error({ title: 'Error', description: 'El proceso se ha cancelado.' })
      }
    }

    workerRef.current.onerror = (e) => {
      Object.keys(TOAST_IDS).forEach((id) => toaster.dismiss(id))
      console.error('worker onerror', e)
      toaster.error({
        title: 'Ocurrió un error',
        description: 'Ocurrió un error inesperado. Por favor, intente nuevamente.'
      })
    }
  }

  function stopWorker() {
    if (workerRef.current) {
      workerRef.current.postMessage({ type: 'stop' } satisfies WorkerIncomingMsg)
      workerRef.current.terminate()
      workerRef.current = null
    }
  }

  async function handleSSEMessage(data: SSEEvent) {
    handleSSEToasts(data)

    switch (data.type) {
      case 'info':
        dispatch({ type: 'SET_NAME_FILE', payload: { nameFile: data.filename } })
        break

      case 'page':
        dispatch({
          type: 'SET_TEXT_PAGES_APPEND',
          payload: {
            page: {
              page: data.page,
              forRender: data.forRender,
              forSpeech: data.forSpeech
            }
          }
        })
        break
      // los demás casos ya los maneja el helper
    }
  }

  useEffect(() => {
    return () => {
      stopWorker()
    }
  }, [])

  return { handleFileUpload, clientMimeTypes, stopWorker }
}

const handleSSEToasts = (data: SSEEvent) => {
  switch (data.type) {
    case 'info':
      toaster.loading({
        id: TOAST_IDS['file-upload'],
        title: `Procesando archivo: ${data.filename}`,
        description: `Procesando páginas: ${data.initPage} - ${data.endPage}. Total de páginas: ${data.totalPages}`
      })
      break

    case 'queue':
      toaster.dismiss(TOAST_IDS['file-upload'])
      toaster.loading({
        id: TOAST_IDS['queue'],
        title: 'Su proceso está en cola.'
      })

      if (data.status === 'started') {
        toaster.update(TOAST_IDS['queue'], { title: 'Procesando archivo...' })
      } else if (data.status === 'waiting') {
        toaster.update(TOAST_IDS['queue'], {
          title: `Proceso en cola`,
          description: data.position ? `Su posición: ${data.position}` : ''
        })
      }
      break

    case 'page':
      if (toaster.isVisible(TOAST_IDS['queue'])) toaster.dismiss(TOAST_IDS['queue'])
      if (toaster.isVisible(TOAST_IDS['file-upload'])) toaster.dismiss(TOAST_IDS['file-upload'])
      toaster.loading({
        id: TOAST_IDS['generating'],
        title: `Completado: ${data.progress}%`
      })
      break

    case 'error':
      Object.keys(TOAST_IDS).forEach((id) => toaster.dismiss(id))
      toaster.error({
        title: 'Error',
        description: `${data.error ?? 'Ocurrió un error'}`
      })
      break

    case 'complete':
      Object.keys(TOAST_IDS).forEach((id) => toaster.dismiss(id))
      toaster.success({
        title: 'Archivo procesado',
        description: 'El archivo se ha procesado correctamente.'
      })
      break
  }
}
