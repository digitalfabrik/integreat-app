// @flow

import * as React from 'react'
import { connect } from 'react-redux'

import CityModel from 'modules/endpoint/models/CityModel'

import GeneralHeader from '../components/GeneralHeader'
import Layout from '../components/Layout'
import GeneralFooter from '../components/GeneralFooter'
import LocationHeader from './LocationHeader'
import LocationFooter from '../components/LocationFooter'
import { CATEGORIES_ROUTE } from '../../app/routes/categories'
import { EVENTS_ROUTE } from '../../app/routes/events'
import { EXTRAS_ROUTE } from '../../app/routes/extras'
import { DISCLAIMER_ROUTE } from '../../app/routes/disclaimer'
import { SEARCH_ROUTE } from '../../app/routes/search'
import CategoriesToolbar from '../../../routes/categories/containers/CategoriesToolbar'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'
import { SPRUNGBRETT_ROUTE } from '../../app/routes/sprungbrett'
import { WOHNEN_ROUTE } from '../../app/routes/wohnen'
import type { LocationState } from 'redux-first-router'
import FeedbackModal from '../../../routes/feedback/components/FeedbackModal'
import LocationToolbar from '../components/LocationToolbar'

export const LocationLayoutRoutes = [CATEGORIES_ROUTE, EVENTS_ROUTE, EXTRAS_ROUTE, SPRUNGBRETT_ROUTE, WOHNEN_ROUTE,
  DISCLAIMER_ROUTE, SEARCH_ROUTE]

type PropsType = {
  cities: ?Array<CityModel>,
  categories: CategoriesMapModel,
  viewportSmall: boolean,
  children?: React.Node,
  location: LocationState
}

type StateType = {
  asideStickyTop: number
}

export class LocationLayout extends React.Component<PropsType, StateType> {
  state = {asideStickyTop: 0}

  onStickyTopChanged = (asideStickyTop: number) => this.setState({asideStickyTop})

  getCurrentCity (): ?CityModel {
    const {location, cities} = this.props
    const city = location.payload.city

    return cities && cities.find(_city => _city.code === city)
  }

  renderFeedbackModal = (): React.Node => {
    const {cities, location, categories} = this.props
    const feedbackStatus = location.query && location.query.feedback
    const payload = location.payload

    let id
    let title
    if (location.type === CATEGORIES_ROUTE && categories) {
      const category = categories.findCategoryByPath(location.pathname)
      if (category) {
        id = category.id
        title = category.title
      }
    }

    return (
      <FeedbackModal
        id={id}
        title={title}
        alias={payload.alias}
        cities={cities}
        feedbackStatus={feedbackStatus}
        location={location} />
    )
  }

  renderToolbar = (): React.Node => {
    const {location, categories} = this.props
    const type = location.type

    if (type === CATEGORIES_ROUTE) {
      return <CategoriesToolbar categories={categories}
                                location={location} />
    } else if (type === EXTRAS_ROUTE || type === EVENTS_ROUTE || type === DISCLAIMER_ROUTE) {
      return <LocationToolbar location={location} />
    } else {
      return null
    }
  }

  render () {
    const {viewportSmall, children, location} = this.props
    const type = location.type
    const {city, language} = location.payload

    const cityModel = this.getCurrentCity()

    if (!cityModel) {
      return <Layout header={<GeneralHeader viewportSmall={viewportSmall} />}
                     footer={<GeneralFooter />}>
        {children}
      </Layout>
    }

    return (
      <Layout asideStickyTop={this.state.asideStickyTop}
              header={<LocationHeader isEventsEnabled={cityModel.eventsEnabled}
                                      isExtrasEnabled={cityModel.extrasEnabled}
                                      onStickyTopChanged={this.onStickyTopChanged} />}
              footer={<LocationFooter city={city} language={language} />}
              toolbar={this.renderToolbar()}
              modal={type !== SEARCH_ROUTE && this.renderFeedbackModal()}>
        {children}
      </Layout>
    )
  }
}

const mapStateToProps = state => ({
  location: state.location,
  viewportSmall: state.viewport.is.small,
  cities: state.cities.data,
  categories: state.categories.data
})

export default connect(mapStateToProps)(LocationLayout)
