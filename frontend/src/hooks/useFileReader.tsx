import { useEffect, useState } from 'react'
import { useUtterance } from './useUtterance'
import { useFileReaderContext, useLocalDataContext, useVoiceContext } from './useCustomContext'
import { tokenizeBlocks } from '@/textParser/tokenizeBlocks'
import {
  DoneEventData,
  ErrorEventData,
  OCREventData,
  QueuedEventData,
  TotalPagesEventData
} from '@shared/OCRStreamTypes'

const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:1234/' : '/'
const POST_FILE_URL = `${BASE_URL}api/v1/upload-file`
const GET_MIME_TYPES_URL = `${BASE_URL}api/v1/get-mime-types`
export const useFileReader = () => {
  const { changeError, changeLoading, changeQueued, changeTotalPages } = useFileReaderContext()
  const { dispatch: voiceDispatch } = useVoiceContext()
  const { stop } = useUtterance()
  const { dispatch } = useLocalDataContext()
  const [clientMimeTypes, setClientMimeTypes] = useState<string[]>([])

  useEffect(() => {
    ;(async () => {
      try {
        const response = await fetch(GET_MIME_TYPES_URL)
        const { data, error } = await response.json()
        if (error) {
          changeError(error)
          return
        }
        if (!data) {
          changeError('Ocurrió un error inesperado, inténtelo más tarde.')
          return
        }
        setClientMimeTypes(data)
      } catch (error) {
        if (error) {
          changeError('Ocurrio un error al leer el archivo.')
        }
      }
    })()
  }, [changeError])

  const handleFileUpload = async (file: File, lang: string, initPage: number, endPage: number) => {
    try {
      changeLoading(true)
      changeError('')
      stop()

      dispatch({ type: 'SET_TEXT_PAGES', payload: { textPages: [] } })
      dispatch({ type: 'SET_PAGE', payload: { currentPage: 0 } })

      voiceDispatch({ type: 'SET_SPEAKING', payload: { speaking: false } })
      voiceDispatch({ type: 'SET_READED_WORD', payload: null })

      dispatch({
        type: 'SET_NAME_FILE',
        payload: { nameFile: file.name }
      })
      const formData = new FormData()
      formData.append('file', file)
      formData.append('lang', lang)
      formData.append('initPage', initPage.toString() ?? '0')
      formData.append('endPage', endPage.toString() ?? '0')
      const res = await fetch(POST_FILE_URL, { method: 'POST', body: formData })
      const { url }: { url: string } = await res.json()
      startOCRStream(url)
    } catch {
      changeError('Ocurrió un error al leer el archivo.')
      changeLoading(false)
    }
  }

  const startOCRStream = (url: string) => {
    const eventSource = new EventSource(url)
    eventSource.addEventListener('total_pages', (ev: MessageEvent) => {
      const { total_pages } = parseEventData<TotalPagesEventData>(ev)
      changeTotalPages(total_pages)
    })
    eventSource.addEventListener('data', (ev: MessageEvent) => {
      changeQueued(0)
      const { text, page } = parseEventData<OCREventData>(ev)
      console.log({
        text,
        page
      })

      const textPage: TextPages = { ...tokenizeBlocks(text), page }
      dispatch({ type: 'SET_TEXT_PAGES_APPEND', payload: { page: textPage } })
    })

    eventSource.addEventListener('queued', (ev: MessageEvent) => {
      const { position } = parseEventData<QueuedEventData>(ev)
      changeQueued(position)
    })

    eventSource.addEventListener('errorEvent', (ev: MessageEvent) => {
      const { message } = parseEventData<ErrorEventData>(ev)
      changeError(message)
      eventSource.close()
      changeLoading(false)
    })

    eventSource.addEventListener('errorReached', () => {
      changeError('Servidor ocupado. Inténtelo en unos minutos.')
      eventSource.close()
      changeLoading(false)
    })

    eventSource.addEventListener('done', (ev: MessageEvent) => {
      const { message } = parseEventData<DoneEventData>(ev)
      console.log(message)
      eventSource.close()
      changeLoading(false)
    })
  }

  return {
    handleFileUpload,
    clientMimeTypes
  }
}

function parseEventData<T>(ev: MessageEvent): T {
  return JSON.parse(ev.data) as T
}
