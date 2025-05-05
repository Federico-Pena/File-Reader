import { useEffect, useState } from 'react'
import { useFileReaderContext, useLocalDataContext, useVoiceContext } from './useCustomContext'
import { useUtterance } from './useUtterance'

const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:1234/' : '/'
const POST_FILE_URL = `${BASE_URL}api/v1/upload-file`
const GET_MIME_TYPES_URL = `${BASE_URL}api/v1/get-mime-types`
export const useFileReader = () => {
  const { changeError, changeLoading, changeQueued } = useFileReaderContext()
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
      voiceDispatch({ type: 'SET_READED_WORDS', payload: { readWord: null } })

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
      const { url } = await res.json()
      console.log('👉 POST_FILE_URL', {
        url
      })
      startOCRStream(url)
    } catch {
      changeError('Ocurrió un error al leer el archivo.')
      changeLoading(false)
    }
  }
  const startOCRStream = (url: string) => {
    const eventSource = new EventSource(url)
    eventSource.addEventListener('data', (ev: MessageEvent) => {
      changeQueued(0)
      const page: TextPages = JSON.parse(ev.data)
      console.log('👉 Event of data', page.page)
      dispatch({
        type: 'SET_TEXT_PAGES_APPEND',
        payload: { page }
      })
    })

    eventSource.addEventListener('error', (ev: MessageEvent) => {
      console.log('📛 Event of error', ev)
      changeError('Error al procesar el archivo.')
      eventSource.close()
      changeLoading(false)
    })
    eventSource.addEventListener('errorEvent', (ev: MessageEvent) => {
      const message: string = JSON.parse(ev.data).message
      console.log('📛 Event of errorEvent')
      console.log(message)
      changeError(message)
      eventSource.close()
      changeLoading(false)
    })
    eventSource.addEventListener('errorReached', (ev: MessageEvent) => {
      const message: string = JSON.parse(ev.data).message
      console.log('📛 Event of errorReached', message)
      changeError('Servidor ocupado. Inténtelo en unos minutos.')
      eventSource.close()
      changeLoading(false)
    })
    eventSource.addEventListener('done', () => {
      console.log('✅ Event of done')
      eventSource.close()
      changeLoading(false)
    })

    eventSource.addEventListener('queued', (ev: MessageEvent) => {
      const position = JSON.parse(ev.data).position
      console.log('👉 Event of queued', position)
      changeQueued(position)
    })
  }

  return {
    handleFileUpload,
    clientMimeTypes
  }
}
