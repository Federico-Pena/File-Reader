import { useEffect, useState } from 'react'
import { getMimeTypes, requestFile } from '@/utils/requestApi'
import { useFileReaderContext, useLocalDataContext, useVoiceContext } from './useCustomContext'
import { useUtterance } from './useUtterance'

const useFileReader = () => {
  const { changeError, changeLoading } = useFileReaderContext()
  const { dispatch: voiceDispatch } = useVoiceContext()
  const { stop } = useUtterance()
  const { dispatch } = useLocalDataContext()
  const [clientMimeTypes, setClientMimeTypes] = useState<string[]>([])

  useEffect(() => {
    ;(async () => {
      try {
        const { data, error } = await getMimeTypes()
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

  const handleFileUpload = async (file: File) => {
    try {
      changeLoading(true)
      changeError('')
      stop()
      dispatch({
        type: 'SET_TEXT_PAGES',
        payload: {
          textPages: []
        }
      })
      dispatch({
        type: 'SET_PAGE',
        payload: {
          currentPage: 0
        }
      })
      voiceDispatch({
        type: 'SET_SPEAKING',
        payload: {
          speaking: false
        }
      })
      voiceDispatch({
        type: 'SET_READED_WORDS',
        payload: {
          readWord: null
        }
      })
      const { data, error } = await requestFile(file)
      if (error) {
        changeError(error)
        return
      }
      if (!data) {
        changeError('Ocurrió un error inesperado, inténtelo más tarde.')
        return
      }
      dispatch({
        type: 'SET_NAME_FILE',
        payload: {
          nameFile: file.name
        }
      })
      dispatch({
        type: 'SET_TEXT_PAGES',
        payload: {
          textPages: data
        }
      })
    } catch (error) {
      changeError('Ocurrio un error al leer el archivo.')
    } finally {
      changeLoading(false)
    }
  }

  return {
    handleFileUpload,
    clientMimeTypes
  }
}
export default useFileReader
