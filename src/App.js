import React from 'react'
import { Provider } from 'react-redux'
import { Route, Router, Switch } from 'react-router-dom'

import PropTypes from 'prop-types'

import store from './store'

import LandingPage from './LandingPage'
import LocationPage from './LocationPage'
import SearchPage from './LocationPage/SearchPage'
import Hierarchy from './LocationPage/Hierarchy'
import ErrorPage from './ErrorPage'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n/i18n'

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

export default App
