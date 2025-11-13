import { LocalDataContext } from '@/context/LocalDataContext'
import { VoiceContext } from '@/context/VoiceContext'
import { useContext } from 'react'

export const useLocalDataContext = () => {
  const context = useContext(LocalDataContext)
  if (context === undefined) {
    throw new Error('useLocalDataContext must be used within a LocalDataContextProvider')
  }
  return context
}

export const useVoiceContext = () => {
  const context = useContext(VoiceContext)
  if (context === undefined) {
    throw new Error('useVoiceContext must be used within a LocalDataContextProvider')
  }
  return context
}
