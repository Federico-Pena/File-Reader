import { useCallback } from 'react'
import { UseFileDataContext } from '@/context/FileDataContext'
import { UseVoiceContext } from '@/context/VoiceContext'

export const useSpeechSynthesisUtterance = () => {
  const {
    dispatch,
    state: { currentPage, textPages, currentWord }
  } = UseFileDataContext()

  const {
    dispatch: voiceDispatch,
    state: { rateUtterance, selectedVoice, volume, voices }
  } = UseVoiceContext()

  const globalText = textPages[currentPage]?.forSpeech ?? ''
  const globalWords = globalText.split(/\s+/)

  const handleOnBoundary = useCallback(
    (event: SpeechSynthesisEvent) => {
      if (event.name === 'word') {
        const startingWordIndex = currentWord?.index ?? 0
        let currentIndex = 0
        let found = false

        for (let i = startingWordIndex; i < globalWords.length; i++) {
          const word = globalWords[i]
          if (currentIndex + word.length >= event.charIndex) {
            dispatch({
              type: 'SET_CURRENT_WORD',
              payload: { word, index: i }
            })
            found = true
            break
          }
          currentIndex += word.length + 1
        }

        if (!found && startingWordIndex < globalWords.length) {
          const word = globalWords[startingWordIndex]
          dispatch({
            type: 'SET_CURRENT_WORD',
            payload: { word, index: startingWordIndex }
          })
        }
      }
    },
    [currentWord, globalWords, dispatch]
  )

  const handleUtteranceEnd = useCallback(() => {
    voiceDispatch({
      type: 'SET_SPEAKING',
      payload: {
        speaking: false
      }
    })
    if (currentPage < textPages.length - 1) {
      dispatch({
        type: 'SET_PAGE',
        payload: { currentPage: currentPage + 1 }
      })
      dispatch({ type: 'SET_CURRENT_WORD', payload: null })
    }
  }, [voiceDispatch, dispatch, currentPage, textPages])

  const handleUtteranceError = useCallback(
    (event: SpeechSynthesisErrorEvent) => {
      if (event.error === 'interrupted') {
        return
      }
      window.speechSynthesis.cancel()
      voiceDispatch({
        type: 'SET_SPEAKING',
        payload: {
          speaking: false
        }
      })
    },
    [voiceDispatch]
  )

  const createUtterance = useCallback(() => {
    if (!textPages || !textPages[currentPage]) return null

    const startingWordIndex = currentWord?.index ?? 0
    const textToRead = globalWords.slice(startingWordIndex).join(' ').trim()

    if (!textToRead) return null

    const utterance = new SpeechSynthesisUtterance(textToRead)
    utterance.voice = voices.find((v) => v.name === selectedVoice?.name) || null
    utterance.rate = rateUtterance
    utterance.volume = volume / 100
    utterance.onboundary = handleOnBoundary
    utterance.onend = handleUtteranceEnd
    utterance.onerror = handleUtteranceError

    return utterance
  }, [
    textPages,
    currentPage,
    currentWord,
    globalWords,
    voices,
    selectedVoice,
    rateUtterance,
    volume,
    handleOnBoundary,
    handleUtteranceEnd,
    handleUtteranceError
  ])

  return { createUtterance }
}
