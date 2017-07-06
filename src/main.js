import 'babel-polyfill'
import 'whatwg-fetch'

import React from 'react'
import ReactDOM from 'react-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import { Provider } from 'react-redux'
import { Route, Router, Switch } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'

import PropTypes from 'prop-types'

// Pages
import LandingPage from './routes/LandingPage'
import LocationPage from './routes/LocationPage'
import SearchPage from './routes/LocationPage/SearchPage'
import Hierarchy from './routes/LocationPage/Hierarchy'
import ErrorPage from './routes/ErrorPage'

// Local imports
import store from './store'
import i18n from './i18n/i18n'

/**
 * The root component of our app
 */
class App extends React.Component {
  static propTypes = {
    history: PropTypes.any.isRequired
  }

  render () {
    return (
      <I18nextProvider i18n={ i18n }>
        <Provider store={store}>
          <Router history={this.props.history}>
            <Switch>
              {/* The root page */}
              <Route path="/" exact component={LandingPage}/>
              {/* The location page */}
              <Route path="/location/:location/search" exact component={SearchPage}/>
              <Route path="/location/:location/:path*" render={props => {
                let path = props.match.params.path
                return <LocationPage {...props} hierarchy={new Hierarchy(path)}/>
              }}/>
              {/* The error page */}
              <Route component={ErrorPage}/>
            </Switch>
          </Router>
        </Provider>
      </I18nextProvider>
    )
  }
}

const container = document.getElementById('container')

/**
 * Holds the current history implementation
 */
export const history = createBrowserHistory()

ReactDOM.render(<App history={history}/>, container)

// Sets the splash to hidden when the page is rendered
document.getElementById('splash').className += ' splash-hidden'

// Enables hot-module-reloading if it's enabled
if (module.hot) {
  module.hot.accept()
}
