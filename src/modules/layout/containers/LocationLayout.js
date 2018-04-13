import * as React from 'react'
import { connect } from 'react-redux'

import CityModel from 'modules/endpoint/models/CityModel'
import EventModel from 'modules/endpoint/models/EventModel'

import GeneralHeader from '../components/GeneralHeader'
import Layout from '../components/Layout'
import GeneralFooter from '../components/GeneralFooter'
import LocationHeader from '../components/LocationHeader'
import LocationFooter from '../components/LocationFooter'
import LanguageModel from '../../endpoint/models/LanguageModel'
import { CATEGORIES_ROUTE } from '../../app/routes/categories'
import { EVENTS_ROUTE } from '../../app/routes/events'
import { EXTRAS_ROUTE } from '../../app/routes/extras'
import { DISCLAIMER_ROUTE } from '../../app/routes/disclaimer'
import { SEARCH_ROUTE } from '../../app/routes/search'
import CategoriesToolbar from '../../../routes/categories/containers/CategoriesToolbar'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'
import { CATEGORIES_REDIRECT_ROUTE } from '../../app/routes/categoriesRedirect'

export const LocationLayoutRoutes = [CATEGORIES_ROUTE, EVENTS_ROUTE, EXTRAS_ROUTE, DISCLAIMER_ROUTE, SEARCH_ROUTE, CATEGORIES_REDIRECT_ROUTE]

type Props = {
  city: string,
  language: string,
  cities: ?Array<CityModel>,
  languages: ?Array<LanguageModel>,
  categories: ?CategoriesMapModel,
  currentRoute: string,
  viewportSmall: boolean,
  children?: Node,
  pathname: string,
  events: Array<EventModel>
}

type State = {
  asideStickyTop: number
}

export class LocationLayout extends React.Component<Props, State> {
  state = {asideStickyTop: 0}

  onStickyTopChanged = asideStickyTop => this.setState({asideStickyTop})

  getCurrentCity (): ?CityModel {
    const cities = this.props.cities
    return cities && cities.find(_city => _city.code === this.props.city)
  }

  render () {
    const {language, city, currentRoute, viewportSmall, children, events, languages, pathname, categories} = this.props
    const cityModel = this.getCurrentCity()
    const isEventsActive = events ? events.length > 0 : false
    const showCategoriesToolbar = currentRoute === CATEGORIES_ROUTE && categories

    if (!cityModel) {
      return <Layout header={<GeneralHeader viewportSmall={viewportSmall} />}
                     footer={<GeneralFooter />}>
        {children}
      </Layout>
    }

    return <Layout
      asideStickyTop={this.state.asideStickyTop}
      header={<LocationHeader viewportSmall={viewportSmall}
                              city={city}
                              currentRoute={currentRoute}
                              language={language}
                              languages={languages}
                              isEventsActive={isEventsActive}
                              isEventsEnabled={cityModel.eventsEnabled}
                              isExtrasEnabled={cityModel.extrasEnabled}
                              onStickyTopChanged={this.onStickyTopChanged} />}
      footer={<LocationFooter city={city} language={language} />}
      toolbar={showCategoriesToolbar &&
      <CategoriesToolbar city={city} language={language} pathname={pathname} categories={categories} />}>
      {children}
    </Layout>
  }
}

const mapStateToProps = state => ({
  currentRoute: state.location.type,
  city: state.location.payload.city,
  language: state.location.payload.language,
  pathname: state.location.pathname,
  viewportSmall: state.viewport.is.small,
  cities: state.cities.data,
  languages: state.languages.data,
  events: state.events.data,
  categories: state.categories.data
})

export default connect(mapStateToProps)(LocationLayout)
