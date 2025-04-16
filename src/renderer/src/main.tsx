import './assets/main.css'
import './assets/base.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)

root.render(
  <StrictMode>
    <App />
  </StrictMode>
)

// Handle hot module replacement
if (import.meta.hot) {
  import.meta.hot.accept()
}
