import React from 'react'
import { hydrate, render } from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'

import App from './App'

const rootElement = document.getElementById('root')
const AppBase = (
  <React.StrictMode>
    <Router>
      <QueryParamProvider ReactRouterRoute={Route}>
        <App />
      </QueryParamProvider>
    </Router>
  </React.StrictMode>
)

if (rootElement?.hasChildNodes()) {
  hydrate(AppBase, rootElement)
} else {
  render(AppBase, rootElement)
}