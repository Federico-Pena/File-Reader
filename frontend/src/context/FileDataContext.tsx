import { createContext, useContext, useEffect, useReducer } from 'react'
import { fileDataContextInitialState, fileDataContextReducer } from './fileDataContextReducer'

const FileDataContext = createContext<FileDataContextType>({
  state: fileDataContextInitialState,
  dispatch: () => null
})

const FileDataContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(fileDataContextReducer, fileDataContextInitialState)
  useEffect(() => {
    if (localStorage.getItem('dataLastFile')) {
      localStorage.removeItem('dataLastFile')
    }
    dispatch({
      type: 'LOAD_STATE'
    })
  }, [])
  return <FileDataContext.Provider value={{ state, dispatch }}>{children}</FileDataContext.Provider>
}

const UseFileDataContext = () => {
  const context = useContext(FileDataContext)
  if (context === undefined) {
    throw new Error('useFileDataContext must be used within a FileDataContextProvider')
  }
  return context
}

export { FileDataContextProvider, UseFileDataContext }
