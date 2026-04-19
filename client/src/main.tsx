import '@ds/tokens/semantic-tokens.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AudioContextProvider } from './contexts/AudioContext'
import { ThemeProvider } from './contexts/ThemeContext'
import App from './App'
import './styles/tokens.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AudioContextProvider>
        <App />
      </AudioContextProvider>
    </ThemeProvider>
  </StrictMode>,
)
