import { createContext, useEffect, useReducer } from 'react'
import { localDataContextReducer } from './localDataContextReducer'

const initialState: LocalDataStateType = {
  lastFiles: [],
  textPages: [],
  currentPage: 0,
  nameFile: ''
}
const LocalDataContext = createContext<LocalDataContextType>({
  state: initialState,
  dispatch: () => null
})

const LocalDataContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(localDataContextReducer, initialState)
  useEffect(() => {
    dispatch({
      type: 'LOAD_STATE'
    })
  }, [])
  return (
    <LocalDataContext.Provider value={{ state, dispatch }}>{children}</LocalDataContext.Provider>
  )
}

export { LocalDataContextProvider, LocalDataContext }
