import { useLocalDataContext, useVoiceContext } from './useCustomContext'

export const useSpeechSynthesisUtterance = () => {
  const {
    dispatch: dataDispatch,
    state: { currentPage, textPages }
  } = useLocalDataContext()

  const {
    dispatch: voiceDispatch,
    state: { rateUtterance, selectedVoice, volume, readWords, voices }
  } = useVoiceContext()

  const globalText = textPages[currentPage]?.cleaned ?? ''
  const globalWords = globalText.split(/\s+/)

  const handleOnBoundary = (event: SpeechSynthesisEvent) => {
    if (event.name === 'word') {
      const startingWordIndex = readWords?.index ?? 0
      let currentIndex = 0
      let found = false

      for (let i = startingWordIndex; i < globalWords.length; i++) {
        const word = globalWords[i]
        if (currentIndex + word.length >= event.charIndex) {
          voiceDispatch({
            type: 'SET_READ_WORD',
            payload: { word, index: i }
          })
          found = true
          break
        }
        currentIndex += word.length + 1
      }

      // fallback de seguridad (por si el evento no cae dentro de ningún rango)
      if (!found && startingWordIndex < globalWords.length) {
        const word = globalWords[startingWordIndex]
        voiceDispatch({
          type: 'SET_READ_WORD',
          payload: { word, index: startingWordIndex }
        })
      }
    }
  }

  const handleOnEnd = () => {
    window.speechSynthesis.cancel()

    if (currentPage < textPages.length - 1) {
      dataDispatch({
        type: 'SET_PAGE',
        payload: { currentPage: currentPage + 1 }
      })
      voiceDispatch({ type: 'SET_READ_WORD', payload: null })
    }

    voiceDispatch({
      type: 'SET_SPEAKING',
      payload: { speaking: false }
    })
  }

  const handleOnError = () => {
    window.speechSynthesis.cancel()
  }

  const handleOnStart = () => {
    voiceDispatch({
      type: 'SET_SPEAKING',
      payload: { speaking: true }
    })
  }

  const createUtterance = () => {
    if (!textPages) return

    const startingWordIndex = readWords?.index ?? 0
    const textToRead = globalWords.slice(startingWordIndex).join(' ').trim()

    const utterance = new SpeechSynthesisUtterance(textToRead)
    utterance.voice = voices.find((v) => v.name === selectedVoice) || null
    utterance.rate = rateUtterance
    utterance.volume = volume
    utterance.onstart = handleOnStart
    utterance.onboundary = handleOnBoundary
    utterance.onend = handleOnEnd
    utterance.onerror = handleOnError

    return utterance
  }

  return { createUtterance }
}
