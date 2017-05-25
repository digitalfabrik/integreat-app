import 'babel-polyfill'
import 'whatwg-fetch'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import {
  Router,
  Route,
  Switch
} from 'react-router-dom'

import createBrowserHistory from 'history/createBrowserHistory'
import store from './store'

import LandingPage from './landing'
import LocationPage from './location'
import ErrorPage from './error'

const container = document.getElementById('container')

const history = createBrowserHistory()

export default history

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={LandingPage}/>
        <Route path="/location/:location" component={LocationPage}/>
        <Route component={ErrorPage}/>
      </Switch>
    </Router>
  </Provider>,
  container)

document.getElementById('splash').className += ' splash-hidden'

if (module.hot) {
  module.hot.accept()
}
