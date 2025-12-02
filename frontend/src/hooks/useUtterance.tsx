import { useCallback, useEffect } from 'react'
import { useSpeechSynthesisUtterance } from './useSpeechSynthesisUtterance'
import { UseVoiceContext } from '@/context/VoiceContext'
import { UseFileDataContext } from '@/context/FileDataContext'

export const useUtterance = () => {
  const { createUtterance } = useSpeechSynthesisUtterance()

  const {
    state: { currentPage },
    dispatch
  } = UseFileDataContext()

  const {
    dispatch: voiceDispatch,
    state: { speaking }
  } = UseVoiceContext()

  useEffect(() => {
    window.speechSynthesis.cancel()
  }, [])

  const play = useCallback(() => {
    if (speaking) {
      return
    }
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel()
    }
    const utterance = createUtterance()
    if (!utterance) {
      console.warn('No se pudo crear utterance')
      return
    }
    setTimeout(() => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel()
      }

      window.speechSynthesis.speak(utterance)
      voiceDispatch({ type: 'SET_SPEAKING', payload: { speaking: true } })
    }, 300)
  }, [speaking, createUtterance, voiceDispatch])

  const pause = useCallback(() => {
    if (speaking && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause()
      voiceDispatch({ type: 'SET_SPEAKING', payload: { speaking: false } })
    }
  }, [speaking, voiceDispatch])

  const togglePlayPause = useCallback(() => {
    if (speaking && window.speechSynthesis.speaking) {
      pause()
    } else {
      play()
    }
  }, [speaking, play, pause])

  const stop = () => {
    window.speechSynthesis.cancel()
    voiceDispatch({
      type: 'SET_SPEAKING',
      payload: {
        speaking: false
      }
    })
    dispatch({
      type: 'SET_CURRENT_WORD',
      payload: null
    })
  }

  useEffect(() => {
    if (currentPage) {
      togglePlayPause()
    }
  }, [currentPage])

  return {
    stop,
    togglePlayPause
  }
}
