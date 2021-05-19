import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { hot } from 'react-hot-loader'

const HMRApp = hot(module)(App)
const container = document.getElementById('container')

ReactDOM.render(<HMRApp />, container)
