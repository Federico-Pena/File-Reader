import { createContext, useState, type ReactNode } from 'react'

const initialState = {
  loading: false,
  error: '',
  queued: 0,
  changeQueued: () => {},
  changeError: () => {},
  changeLoading: () => {}
}

const FileReaderContext = createContext<FileReaderContextType>(initialState)

const FileReaderProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(initialState.loading)
  const [error, setError] = useState(initialState.error)
  const [queued, setQueued] = useState(initialState.queued)

  const changeLoading = (isLoading: boolean) => {
    setLoading(isLoading)
  }

  const changeError = (error: string) => {
    setError(error)
  }
  const changeQueued = (position: number) => {
    setQueued(position)
  }
  return (
    <FileReaderContext.Provider
      value={{ queued, loading, error, changeError, changeLoading, changeQueued }}
    >
      {children}
    </FileReaderContext.Provider>
  )
}

export { FileReaderProvider, FileReaderContext }
