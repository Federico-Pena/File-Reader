import { LocalDataContext } from '@/context/LocalDataContext'
import { VoiceContext } from '@/context/VoiceContext'
import { useContext } from 'react'
import { FileReaderContext } from '../context/FileReaderContext'

export const useFileReaderContext = () => {
  const context = useContext(FileReaderContext)
  if (context === undefined) {
    throw new Error('useFileReaderContext must be used within a FileReaderProvider')
  }
  return context
}

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
