import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LocalDataContextProvider } from './context/LocalDataContext.tsx'
import { FileReaderProvider } from './context/FileReaderContext.tsx'
import { VoiceProvider } from './context/VoiceContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VoiceProvider>
      <FileReaderProvider>
        <LocalDataContextProvider>
          <App />
        </LocalDataContextProvider>
      </FileReaderProvider>
    </VoiceProvider>
  </StrictMode>
)
