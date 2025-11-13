import { useEffect, useRef, useState } from 'react'
import { useUtterance } from './useUtterance'
import { useLocalDataContext, useVoiceContext } from './useCustomContext'
import { toaster } from '@/components/ui/toaster'
import { SSEEvent } from '@shared/sse/events'

const BASE_URL =
  import.meta.env.MODE === 'development' ? 'http://localhost:1234/' : '/'
const POST_FILE_URL = `${BASE_URL}api/v1/upload-file`
const GET_MIME_TYPES_URL = `${BASE_URL}api/v1/get-mime-types`

export const useFileReader = () => {
  const { dispatch } = useLocalDataContext()
  const { dispatch: voiceDispatch } = useVoiceContext()
  const { stop } = useUtterance()
  const [clientMimeTypes, setClientMimeTypes] = useState<string[]>([])
  const workerRef = useRef<Worker | null>(null)
  const toastIDS = {
    'mime-types': 'mime-types',
    'file-upload': 'file-upload',
    queue: 'queue',
    generating: 'generating'
  }

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
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
        workerRef.current = null
      }
    }
  }, [])

  const handleFileUpload = async (
    file: File,
    lang: string,
    initPage: string,
    endPage: string
  ) => {
    stop()
    dispatch({ type: 'CLEAN_TEXT_PAGES' })
    voiceDispatch({ type: 'SET_SPEAKING', payload: { speaking: false } })
    voiceDispatch({ type: 'SET_READ_WORD', payload: null })

    toaster.loading({
      id: toastIDS['file-upload'],
      title: 'Subiendo y procesando archivo...'
    })
    dispatch({ type: 'SET_NAME_FILE', payload: { nameFile: file.name } })

    if (workerRef.current) {
      workerRef.current.terminate()
      workerRef.current = null
    }

    workerRef.current = new Worker(
      new URL('@/workers/sseWorker.ts', import.meta.url),
      {
        type: 'module'
      }
    )

    workerRef.current.onmessage = (evt: MessageEvent) => {
      const msg = evt.data
      if (msg.type === 'sse') {
        handleSSEMessage(msg.data as SSEEvent)
      } else if (msg.type === 'done') {
        Object.keys(toastIDS).forEach((id) => toaster.dismiss(id))
        toaster.success({
          title: 'Archivo procesado',
          description: 'El archivo se ha procesado correctamente.'
        })
      } else if (msg.type === 'error' || msg.type === 'parse-error') {
        console.error('worker error', msg)
        Object.keys(toastIDS).forEach((id) => toaster.dismiss(id))
        toaster.error({ title: 'Error', description: String(msg.error) })
      } else if (msg.type === 'aborted') {
        console.log('worker aborted')
      }
    }

    workerRef.current.onerror = (e) => {
      console.error('worker onerror', e)
      toaster.error({
        title: 'Error en worker',
        description: e.message ?? 'Error desconocido'
      })
    }

    workerRef.current.postMessage({
      type: 'start',
      file,
      lang,
      initPage,
      endPage,
      postUrl: POST_FILE_URL
    } as const)
  }

  function stopWorker() {
    if (workerRef.current) {
      workerRef.current.postMessage({ type: 'stop' })
      workerRef.current.terminate()
      workerRef.current = null
    }
  }

  async function handleSSEMessage(data: SSEEvent) {
    switch (data.type) {
      case 'info':
        console.log('info', data)
        break
      case 'queue':
        toaster.dismiss(toastIDS['file-upload'])
        toaster.loading({
          id: toastIDS['queue'],
          title: 'Su proceso está en cola.'
        })
        if (data.status === 'started') {
          toaster.update(toastIDS['queue'], { title: 'Procesando archivo...' })
        } else if (data.status === 'waiting') {
          toaster.update(toastIDS['queue'], {
            title: `Proceso en cola`,
            description: data.position ? `Su posición: ${data.position}` : ''
          })
        }
        break
      case 'page':
        if (toaster.isVisible(toastIDS['queue']))
          toaster.dismiss(toastIDS['queue'])
        if (toaster.isVisible(toastIDS['file-upload']))
          toaster.dismiss(toastIDS['file-upload'])
        toaster.loading({
          id: toastIDS['generating'],
          title: `Completado: ${data.progress}%`
        })

        dispatch({
          type: 'SET_TEXT_PAGES_APPEND',
          payload: {
            page: {
              rawText: data.rawText,
              page: data.pageNumber,
              withLineBreaks: (data as any).blocks,
              cleaned: (data as any).textCleaned
            }
          }
        })
        break
      case 'error':
        console.log('error', data)
        Object.keys(toastIDS).forEach((id) => toaster.dismiss(id))
        toaster.error({
          title: 'Error',
          description: `${(data as any).error ?? 'Ocurrió un error'}`
        })
        break
      case 'complete':
        Object.keys(toastIDS).forEach((id) => toaster.dismiss(id))
        toaster.success({
          title: 'Archivo procesado',
          description: 'El archivo se ha procesado correctamente.'
        })
        break
    }
  }

  useEffect(() => {
    return () => {
      stopWorker()
    }
  }, [])

  return { handleFileUpload, clientMimeTypes, stopWorker }
}
