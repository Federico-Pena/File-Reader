import { useCallback, useEffect } from 'react'
import { useSpeechSynthesisUtterance } from './useSpeechSynthesisUtterance'
import { useLocalDataContext, useVoiceContext } from './useCustomContext'

export const useUtterance = () => {
  const { createUtterance } = useSpeechSynthesisUtterance()
  const {
    state: { currentPage }
  } = useLocalDataContext()
  const {
    dispatch: voiceDispatch,
    state: { speaking }
  } = useVoiceContext()

  useEffect(() => {
    window.speechSynthesis.cancel()
  }, [])

  const play = useCallback(() => {
    //  console.log('play')

    setTimeout(() => {
      const utterance = createUtterance()
      if (!utterance) return
      window.speechSynthesis.speak(utterance)
      if (speaking) {
        window.speechSynthesis.pause()
        voiceDispatch({
          type: 'SET_SPEAKING',
          payload: {
            speaking: false
          }
        })
      } else {
        window.speechSynthesis.resume()
        voiceDispatch({
          type: 'SET_SPEAKING',
          payload: {
            speaking: true
          }
        })
      }
    }, 500)
  }, [speaking, createUtterance, voiceDispatch])

  const stop = () => {
    window.speechSynthesis.cancel()
    voiceDispatch({
      type: 'SET_SPEAKING',
      payload: {
        speaking: false
      }
    })
    voiceDispatch({
      type: 'SET_READ_WORD',
      payload: null
    })
  }

  useEffect(() => {
    if (currentPage) {
      play()
    }
  }, [currentPage])

  return {
    play,
    stop
  }
}
