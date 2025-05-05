import { useFileReaderContext, useLocalDataContext, useVoiceContext } from './useCustomContext'

export const useSpeechSynthesisUtterance = () => {
  const {
    dispatch: dataDispatch,
    state: { currentPage, textPages }
  } = useLocalDataContext()
  const { loading } = useFileReaderContext()

  const {
    dispatch: voiceDispatch,
    state: { rateUtterance, selectedVoice, volume, readWords, voices }
  } = useVoiceContext()

  const globalText = textPages[currentPage]?.cleaned ?? ''

  const handleOnBoundary = (event: SpeechSynthesisEvent) => {
    if (event.name === 'word') {
      const globalWords = globalText.split(/\s+/g)
      let currentIndex = 0
      let currentWord = ''
      const startingWordIndex = readWords[readWords.length - 1]?.index ?? 0
      const truncatedWords = globalWords.slice(startingWordIndex)
      for (let i = 0; i < truncatedWords.length; i++) {
        if (currentIndex + truncatedWords[i].length >= event.charIndex) {
          currentWord = truncatedWords[i]
          const globalIndex = startingWordIndex + i
          voiceDispatch({
            type: 'SET_READED_WORDS',
            payload: {
              readWord: { word: currentWord, index: globalIndex }
            }
          })
          break
        }
        currentIndex += truncatedWords[i].length + 1
      }
    }
  }

  const handleOnEnd = () => {
    window.speechSynthesis.cancel()
    if (currentPage < textPages.length - 1) {
      const nextPage = currentPage + 1
      dataDispatch({
        type: 'SET_PAGE',
        payload: {
          currentPage: nextPage
        }
      })
      voiceDispatch({
        type: 'SET_READED_WORDS',
        payload: {
          readWord: null
        }
      })
    }
    voiceDispatch({
      type: 'SET_SPEAKING',
      payload: {
        speaking: false
      }
    })
  }

  const handleOnError = () => {
    window.speechSynthesis.cancel()
  }
  const handleOnStart = () => {
    voiceDispatch({
      type: 'SET_SPEAKING',
      payload: {
        speaking: window.speechSynthesis.speaking
      }
    })
  }

  const createUtterance = () => {
    if (!textPages) return
    if (loading && textPages.length < 3) return
    if (!voices) return
    let textToRead = globalText
    const startingWordIndex = readWords[readWords.length - 1]?.index
    if (startingWordIndex && typeof startingWordIndex === 'number') {
      const words = globalText.split(' ')
      textToRead = words.slice(startingWordIndex).join(' ')
    }
    const utterance = new SpeechSynthesisUtterance(textToRead)
    utterance.voice = voices.find((voice) => voice.name === selectedVoice) || null
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
