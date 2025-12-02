import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { FileDataContextProvider } from './context/FileDataContext.tsx'
import { VoiceProvider } from './context/VoiceContext.tsx'
import { Provider } from './components/ui/provider.tsx'
import './index.css'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <FileDataContextProvider>
        <VoiceProvider>
          <App />
        </VoiceProvider>
      </FileDataContextProvider>
    </Provider>
  </StrictMode>
)
