import { createContext, useState, type ReactNode } from 'react'

const initialState = {
  loading: false,
  error: '',
  changeError: () => {},
  changeLoading: () => {}
}

const FileReaderContext = createContext<FileReaderContextType>(initialState)

const FileReaderProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(initialState.loading)
  const [error, setError] = useState(initialState.error)

  const changeLoading = (isLoading: boolean) => {
    setLoading(isLoading)
  }

  const changeError = (error: string) => {
    setError(error)
  }

  return (
    <FileReaderContext.Provider value={{ loading, error, changeError, changeLoading }}>
      {children}
    </FileReaderContext.Provider>
  )
}

export { FileReaderProvider, FileReaderContext }
