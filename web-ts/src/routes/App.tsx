import React, { useCallback } from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import LandingPage from './landing/LandingPage'
import ErrorPage from './errors/ErrorPage'
import { useLoadFromEndpoint, LANDING_ROUTE, CityModel, createCitiesEndpoint } from 'api-client'
import CityContentSwitcher from './CityContentSwitcher'
import { cmsApiBaseUrl } from '../constants/urls'
import { ThemeProvider } from 'styled-components'
import buildConfig from '../constants/buildConfig'

const App = () => {
  const requestCities = useCallback(async () => createCitiesEndpoint(cmsApiBaseUrl).request(undefined), [])
  const { data: cities, loading, error } = useLoadFromEndpoint<CityModel[]>(requestCities)
  // TODO IGAPP-643
  const detectedLanguage = 'de'

  if (loading) {
    return <>App loading!</>
  }

  if (error || !cities) {
    return <>{error?.message ?? 'error'}</>
  }

  return (
    <ThemeProvider theme={buildConfig().lightTheme}>
      <Router>
        <Switch>
          <Redirect exact from={`/${LANDING_ROUTE}?`} to={`/${LANDING_ROUTE}/${detectedLanguage}`} />
          <Route path={`/${LANDING_ROUTE}/:languageCode?`} exact component={LandingPage} />
          <Redirect exact from={`/:cityCode`} to={`/:cityCode/${detectedLanguage}`} />
          <Route
            path={`/:cityCode/:languageCode`}
            render={props => <CityContentSwitcher cities={cities} {...props} />}
          />
          <Route path={`/`} component={ErrorPage} />
        </Switch>
      </Router>
    </ThemeProvider>
  )
}

export default App
