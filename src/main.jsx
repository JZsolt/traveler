import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// iOS PWA standalone: patch text selection
// iOS strips user-select in standalone, this re-enables it
if (window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
  document.documentElement.style.cssText += '-webkit-user-select: text !important; user-select: text !important;'

  // Force all existing and future elements to allow selection
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          node.style.webkitUserSelect = 'text'
        }
      })
    })
  })
  observer.observe(document.body || document.documentElement, { childList: true, subtree: true })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
