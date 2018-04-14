// @flow

import CityModel from '../../endpoint/models/CityModel'
import React from 'react'
import { CATEGORIES_ROUTE } from '../routes/categories'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'
import { connect } from 'react-redux'
import EventModel from '../../endpoint/models/EventModel'
import ReactHelmet from 'react-helmet'
import { EVENTS_ROUTE } from '../routes/events'
import { DISCLAIMER_ROUTE } from '../routes/disclaimer'
import { EXTRAS_ROUTE } from '../routes/extras'
import { SEARCH_ROUTE } from '../routes/search'
import { MAIN_DISCLAIMER_ROUTE } from '../routes/mainDisclaimer'
import ExtraModel from '../../endpoint/models/ExtraModel'
import { translate } from 'react-i18next'
import compose from 'lodash/fp/compose'
import { LANDING_ROUTE } from '../routes/landing'

import type { Location } from 'redux-first-router/dist/flow-types'

type Props = {
  location: Location,
  categories: ?CategoriesMapModel,
  cities: ?Array<CityModel>,
  events: ?Array<EventModel>,
  extras: ?Array<ExtraModel>,
  t: string => string
}

export class Helmet extends React.Component<Props> {
  getRoutePageTitle (): ?string {
    const {location, categories, events, extras, t} = this.props
    const currentRoute = location.type
    const pathname = location.pathname

    switch (currentRoute) {
      case CATEGORIES_ROUTE:
        if (categories) {
          const category = categories.findCategoryByUrl(pathname)
          if (category) {
            if (category.id !== 0) {
              return category.title
            }
          }
        }
        break
      case EVENTS_ROUTE:
        const eventId = location.payload.eventId
        if (eventId) {
          if (events) {
            const event = events.find(event => event.id === eventId)
            if (event) {
              return event.title
            }
          }
        } else {
          return t('eventsTitle')
        }
        break
      case DISCLAIMER_ROUTE:
        return t('disclaimerTitle')
      case EXTRAS_ROUTE:
        const extraAlias = location.payload.extraAlias
        if (extraAlias) {
          if (extras) {
            const extra = extras.find(extra => extra.alias === extraAlias)
            if (extra) {
              return extra.title
            }
          }
        } else {
          return t('extrasTitle')
        }
        break
      case SEARCH_ROUTE:
        return t('searchTitle')
      case MAIN_DISCLAIMER_ROUTE:
        return t('disclaimerTitle')
      case LANDING_ROUTE:
        return t('landingTitle')
    }
  }

  getPageTitle (): string {
    const {cities, location} = this.props
    const city = location.payload.city

    const routePageTitle = this.getRoutePageTitle()
    const cityName = cities && city && CityModel.findCityName(cities, city)
    return `${routePageTitle ? `${routePageTitle} - ` : ''}${cityName ? `${cityName}` : 'Integreat'}`
  }

  render () {
    return <ReactHelmet>
      <title>{this.getPageTitle()}</title>
    </ReactHelmet>
  }
}

const mapStateToProps = state => ({
  location: state.location,
  cities: state.cities.data,
  categories: state.categories.data,
  events: state.events.data,
  extras: state.extras.data
})

export default compose(
  connect(mapStateToProps),
  translate('app')
)(Helmet)
