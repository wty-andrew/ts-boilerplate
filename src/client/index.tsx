import 'regenerator-runtime/runtime'
import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'

import './assets/styles/main.css'
import App from './App'

render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
)

if (module.hot) {
  module.hot.accept()
}
