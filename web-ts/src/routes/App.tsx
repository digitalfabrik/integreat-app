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

export const Routes = {
  LANDING_ROUTE: 'landing',
  CATEGORIES_ROUTE: '',
  EVENTS_ROUTE: 'events',
  OFFERS_ROUTE: 'offers',
  POIS_ROUTE: 'locations',
  LOCAL_NEWS_ROUTE: 'news/local',
  TUNEWS_ROUTE: 'news/tu-news',
  SEARCH_ROUTE: 'search',
  DISCLAIMER_ROUTE: 'disclaimer',
  NOT_FOUND_ROUTE: 'not-found'
} as const

function App() {
  return (
    <Router>
      <Switch>
        <Route path={`/:language/${Routes.LANDING_ROUTE}`} exact component={LandingPage} />
        <Route path={`/:city/:language/${Routes.EVENTS_ROUTE}/:eventId?`} exact component={EventsPage} />
        <Route path={`/:city/:language/${Routes.OFFERS_ROUTE}/:offerId?`} exact component={OffersPage} />
        <Route path={`/:city/:language/${Routes.POIS_ROUTE}/:locationId?`} exact component={PoisPage} />
        <Route path={`/:city/:language/${Routes.LOCAL_NEWS_ROUTE}/:newsId?`} exact component={NewsPage} />
        <Route path={`/:city/:language/${Routes.TUNEWS_ROUTE}/:newsId?`} exact component={NewsPage} />
        <Route path={`/:city/:language/${Routes.SEARCH_ROUTE}`} exact component={SearchPage} />
        <Route path={`/:city/:language/${Routes.DISCLAIMER_ROUTE}`} component={DisclaimerPage} />
        <Route path={`/:city/:language/${Routes.CATEGORIES_ROUTE}:categoriesId?`} exact component={CategoriesPage} />
        <Route path={`/`} component={ErrorPage} />
      </Switch>
    </Router>
  )
}

export default App
