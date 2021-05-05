import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import LandingPage from './landing/LandingPage'
import OffersPage from './offers/OffersPage'
import EventsPage from './events/EventsPage'
import CategoriesPage from './categories/CategoriesPage'
import PoisPage from './pois/PoisPage'
import NewsPage from './news/NewsPage'
import SearchPage from './search/SearchPage'
import DisclaimerPage from './disclaimer/DisclaimerPage'
import ErrorPage from './errors/ErrorPage'

const RouteNames = {
  LANDING_ROUTE: 'landing',
  CATEGORIES_ROUTE: '',
  EVENTS_ROUTE: 'events',
  OFFERS_ROUTE: 'offers',
  POIS_ROUTE: 'locations',
  LOCAL_NEWS_ROUTE: 'news/local',
  TUNEWS_ROUTE: 'news/tu-news',
  SEARCH_ROUTE: 'search',
  DISCLAIMER_ROUTE: 'disclaimer',
  NOT_FOUND_ROUTE: 'not-fount'
} as const

function App() {
  return (
    <Router>
      <Switch>
        <Route path={`/:language/${RouteNames.LANDING_ROUTE}`} exact component={LandingPage} />
        <Route path={`/:city/:language/${RouteNames.CATEGORIES_ROUTE}`} exact component={CategoriesPage} />
        <Route path={`/:city/:language/${RouteNames.EVENTS_ROUTE}`} exact component={EventsPage} />
        <Route path={`/:city/:language/${RouteNames.OFFERS_ROUTE}`} exact component={OffersPage} />
        <Route path={`/:city/:language/${RouteNames.POIS_ROUTE}`} exact component={PoisPage} />
        <Route path={`/:city/:language/${RouteNames.LOCAL_NEWS_ROUTE}`} exact component={NewsPage} />
        <Route path={`/:city/:language/${RouteNames.TUNEWS_ROUTE}`} exact component={NewsPage} />
        <Route path={`/:city/:language/${RouteNames.SEARCH_ROUTE}`} exact component={SearchPage} />
        <Route path={`/:city/:language/${RouteNames.DISCLAIMER_ROUTE}`} component={DisclaimerPage} />
        <Route path={`/`} component={ErrorPage} />
      </Switch>
    </Router>
  )
}

export default App
