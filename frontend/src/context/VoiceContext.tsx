import { createContext, useContext, useEffect, useReducer } from 'react'
import { voiceContextReducer } from './voiceContextReducer'
import { getLocalStorageItem } from '@/utils/updateLocalStorage'

const initialState: VoiceStateType = {
  voices: [],
  selectedVoice: null,
  speaking: window.speechSynthesis.speaking ?? false,
  rateUtterance: 1,
  volume: 100
}
const VoiceContext = createContext<VoiceContextType>({
  state: initialState,
  dispatch: () => null
})

const VoiceProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(voiceContextReducer, initialState)

  useEffect(() => {
    dispatch({
      type: 'LOAD_STATE'
    })
    let attempts = 0
    const maxAttempts = 5

    const populateVoices = async () => {
      const voices = window.speechSynthesis
        .getVoices()
        .filter((voice) => voice.lang.includes('es') || voice.lang.includes('en-US'))
        .sort((a, b) => a.name.localeCompare(b.name))
      dispatch({ type: 'SET_VOICES', payload: { voices } })

      if (voices.length === 0 && attempts < maxAttempts) {
        attempts++
        setTimeout(populateVoices, 500)
        return
      }
      const dataLocalStorage = getLocalStorageItem('voiceState')
      if (!dataLocalStorage) {
        dispatch({ type: 'SET_CURRENT_VOICE', payload: { voice: voices[0] } })
        return
      }
      const selectedVoice = voices.find((voice) => voice.name === dataLocalStorage.voiceName) ?? voices[0]
      dispatch({ type: 'SET_CURRENT_VOICE', payload: { voice: selectedVoice } })
    }

    window.speechSynthesis.onvoiceschanged = populateVoices
    populateVoices()
  }, [])

  return <VoiceContext.Provider value={{ state, dispatch }}>{children}</VoiceContext.Provider>
}

const UseVoiceContext = () => {
  const context = useContext(VoiceContext)
  if (context === undefined) {
    throw new Error('useVoiceContext must be used within a VoiceContextProvider')
  }
  return context
}

export { VoiceProvider, UseVoiceContext }
