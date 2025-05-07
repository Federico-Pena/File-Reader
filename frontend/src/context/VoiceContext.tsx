import { createContext, useEffect, useReducer } from 'react'
import { voiceContextReducer } from './voiceContextReducer'

const initialState: VoiceStateType = {
  voices: [],
  selectedVoice: '',
  speaking: false,
  rateUtterance: 1,
  volume: 1,
  readWords: null
}
const VoiceContext = createContext<VoiceContextType>({
  state: initialState,
  dispatch: () => null
})

const VoiceProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(voiceContextReducer, initialState)

  useEffect(() => {
    let attempts = 0
    const maxAttempts = 5

    const populateVoices = async () => {
      const voices = window.speechSynthesis.getVoices()
      if (voices.length === 0 && attempts < maxAttempts) {
        attempts++
        setTimeout(populateVoices, 500)
        return
      }
      if (voices.length > 0) {
        dispatch({ type: 'SET_VOICES', payload: { voices } })
        const stringData = window.localStorage.getItem('dataLastFile')
        const selectedVoice = stringData ? JSON.parse(stringData).selectedVoice : voices[0].name
        dispatch({ type: 'SET_VOICE_NAME', payload: { voice: selectedVoice } })
      }
    }
    window.speechSynthesis.onvoiceschanged = populateVoices
    populateVoices()
  }, [])

  return <VoiceContext.Provider value={{ state, dispatch }}>{children}</VoiceContext.Provider>
}

export { VoiceProvider, VoiceContext }
