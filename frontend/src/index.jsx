import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.jsx'
import { AuthProvider } from './router/context.js'
import { StrictMode } from 'react'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </AuthProvider>,
)
