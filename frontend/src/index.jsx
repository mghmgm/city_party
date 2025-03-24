import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.jsx'
import { AuthProvider } from './router/context.js'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
  </AuthProvider>,
)
