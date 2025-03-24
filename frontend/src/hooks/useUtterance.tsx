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

  const pause = useCallback(() => {
    window.speechSynthesis.pause()
    voiceDispatch({
      type: 'SET_SPEAKING',
      payload: {
        speaking: false
      }
    })
  }, [voiceDispatch])

  const resume = useCallback(() => {
    window.speechSynthesis.resume()
    voiceDispatch({
      type: 'SET_SPEAKING',
      payload: {
        speaking: true
      }
    })
  }, [voiceDispatch])

  const play = useCallback(() => {
    const utterance = createUtterance()
    if (!utterance) return

    window.speechSynthesis.speak(utterance)
    if (speaking) {
      pause()
    } else {
      resume()
    }
  }, [speaking, createUtterance, pause, resume])

  const stop = () => {
    window.speechSynthesis.cancel()
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
  }

  useEffect(() => {
    play()
  }, [currentPage])

  return {
    play,
    stop
  }
}
