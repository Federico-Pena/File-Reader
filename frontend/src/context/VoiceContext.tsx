import { createContext, useEffect, useReducer } from 'react'
import { voiceContextReducer } from './voiceContextReducer'

const initialState: VoiceStateType = {
  voices: [],
  selectedVoice: '',
  speaking: false,
  rateUtterance: 1,
  volume: 1,
  readWords: []
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
    const populateVoices = async () => {
      const voices = window.speechSynthesis.getVoices()
      if (voices.length > 0) {
        dispatch({
          type: 'SET_VOICES',
          payload: {
            voices: voices
          }
        })
        const stringData = window.localStorage.getItem('dataLastFile')
        if (stringData !== null) {
          const { selectedVoice } = JSON.parse(stringData)
          if (selectedVoice !== null) return
          dispatch({
            type: 'SET_VOICE_NAME',
            payload: {
              voice: selectedVoice
            }
          })
        } else {
          dispatch({
            type: 'SET_VOICE_NAME',
            payload: {
              voice: voices[0].name
            }
          })
        }
      } else {
        setTimeout(async () => {
          await populateVoices()
        }, 500)
      }
    }

    window.speechSynthesis.onvoiceschanged = () => populateVoices()
    populateVoices()
  }, [])

  return <VoiceContext.Provider value={{ state, dispatch }}>{children}</VoiceContext.Provider>
}

export { VoiceProvider, VoiceContext }
