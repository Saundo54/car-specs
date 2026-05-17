import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initializeTheme } from './theme'
import './registerSW'
import { glossaryManager } from './services/GlossaryManager'
// import { Amplify } from 'aws-amplify'
// import amplifyconfig from '../amplify_outputs.json'

// Amplify.configure(amplifyconfig)
initializeTheme();
glossaryManager.loadGlossary();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
