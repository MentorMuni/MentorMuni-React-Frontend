import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import './index.css'
import App from './App.jsx'
import { NewUIProvider } from './context/NewUIContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <NewUIProvider>
        <App />
      </NewUIProvider>
    </MotionConfig>
  </StrictMode>,
)
