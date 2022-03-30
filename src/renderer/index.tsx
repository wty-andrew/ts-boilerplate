import 'regenerator-runtime/runtime'
import React from 'react'
import { createRoot } from 'react-dom/client'

import './assets/styles/main.css'
import App from './App'

const root = createRoot(document.getElementById('root') as HTMLElement)
root.render(<App />)

if (module.hot) {
  module.hot.accept()
}
