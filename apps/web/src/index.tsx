import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'

import './assets/styles/main.css'
import App from './App'

const root = createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <Router>
    <App />
  </Router>
)

if (module.hot) {
  module.hot.accept()
}
