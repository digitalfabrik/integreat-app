// @flow

import * as React from 'react'
import { connect } from 'react-redux'

import CityModel from 'modules/endpoint/models/CityModel'

import GeneralHeader from '../components/header/GeneralHeader'
import Layout from '../components/Layout'
import GeneralFooter from '../components/footer/GeneralFooter'
import LocationHeader from './LocationHeader'
import LocationFooter from '../components/footer/LocationFooter'
import { CATEGORIES_ROUTE } from '../../app/routes/categories'
import { EVENTS_ROUTE } from '../../app/routes/events'
import { EXTRAS_ROUTE } from '../../app/routes/extras'
import { DISCLAIMER_ROUTE } from '../../app/routes/disclaimer'
import { SEARCH_ROUTE } from '../../app/routes/search'
import CategoriesToolbar from '../../../routes/categories/containers/CategoriesToolbar'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'
import { SPRUNGBRETT_ROUTE } from '../../app/routes/sprungbrett'
import { WOHNEN_ROUTE } from '../../app/routes/wohnen'

export const LocationLayoutRoutes = [CATEGORIES_ROUTE, EVENTS_ROUTE, EXTRAS_ROUTE, SPRUNGBRETT_ROUTE, WOHNEN_ROUTE, DISCLAIMER_ROUTE, SEARCH_ROUTE]

type PropsType = {
  city: string,
  language: string,
  cities: ?Array<CityModel>,
  categories: CategoriesMapModel,
  currentRoute: string,
  viewportSmall: boolean,
  children?: React.Node,
  pathname: string
}

type StateType = {
  asideStickyTop: number
}

export class LocationLayout extends React.Component<PropsType, StateType> {
  state = {asideStickyTop: 0}

  onStickyTopChanged = (asideStickyTop: number) => this.setState({asideStickyTop})

  getCurrentCity (): ?CityModel {
    const cities = this.props.cities
    return cities && cities.find(_city => _city.code === this.props.city)
  }

  render () {
    const {language, city, currentRoute, viewportSmall, children, pathname, categories} = this.props
    const cityModel = this.getCurrentCity()
    const showCategoriesToolbar = currentRoute === CATEGORIES_ROUTE && categories

    if (!cityModel) {
      return <Layout header={<GeneralHeader viewportSmall={viewportSmall} />}
                     footer={<GeneralFooter />}>
        {children}
      </Layout>
    }

    return <Layout asideStickyTop={this.state.asideStickyTop}
                   header={<LocationHeader isEventsEnabled={cityModel.eventsEnabled}
                                           isExtrasEnabled={cityModel.extrasEnabled}
                                           onStickyTopChanged={this.onStickyTopChanged} />}
                   footer={<LocationFooter city={city} language={language} />}
                   toolbar={showCategoriesToolbar && <CategoriesToolbar city={city}
                                                                        language={language}
                                                                        pathname={pathname}
                                                                        categories={categories} />}>
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
  categories: state.categories.data
})

export default connect(mapStateToProps)(LocationLayout)
