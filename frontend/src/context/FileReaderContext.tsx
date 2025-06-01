import { createContext, useState, type ReactNode } from 'react'

const initialState = {
  loading: false,
  error: '',
  queued: 0,
  totalPages: 0,
  changeQueued: () => {},
  changeError: () => {},
  changeLoading: () => {},
  changeTotalPages: () => {}
}

const FileReaderContext = createContext<FileReaderContextType>(initialState)

const FileReaderProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(initialState.loading)
  const [error, setError] = useState(initialState.error)
  const [queued, setQueued] = useState(initialState.queued)
  const [totalPages, setTotalPages] = useState(initialState.totalPages)

  const changeLoading = (isLoading: boolean) => {
    setLoading(isLoading)
  }

  const changeError = (error: string) => {
    setError(error)
  }
  const changeQueued = (position: number) => {
    setQueued(position)
  }
  const changeTotalPages = (totalPages: number) => {
    setTotalPages(totalPages)
  }
  return (
    <FileReaderContext.Provider
      value={{
        totalPages,
        queued,
        loading,
        error,
        changeError,
        changeLoading,
        changeQueued,
        changeTotalPages
      }}
    >
      {children}
    </FileReaderContext.Provider>
  )
}

export { FileReaderProvider, FileReaderContext }
