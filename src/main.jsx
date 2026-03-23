import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// iOS PWA standalone: force text selection
// The contentEditable trick is the most reliable way on iOS standalone
const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches
if (isStandalone) {
  document.addEventListener('DOMContentLoaded', () => {
    // Mark root as contentEditable=false — paradoxically this enables selection on iOS
    const root = document.getElementById('root')
    if (root) {
      root.setAttribute('contentEditable', 'false')
      root.style.webkitUserSelect = 'text'
      root.style.userSelect = 'text'
      root.style.outline = 'none'
    }
    document.documentElement.style.webkitUserSelect = 'text'
    document.body.style.webkitUserSelect = 'text'
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
