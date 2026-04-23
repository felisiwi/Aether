import '../../vendor/DesignSystem/src/tokens/semantic-tokens.css'
import '../../vendor/DesignSystem/src/tokens/dark-marketing-surface.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AudioContextProvider } from './contexts/AudioContext'
import { ThemeProvider } from './contexts/ThemeContext'
import App from './App'
import './styles/tokens.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AudioContextProvider>
          <App />
        </AudioContextProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
