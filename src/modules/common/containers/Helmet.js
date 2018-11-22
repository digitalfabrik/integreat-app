// @flow

import * as React from 'react'
import type { StateType } from '../../app/StateType'
import { connect } from 'react-redux'
import {
  CategoriesMapModel,
  EventModel,
  LanguageModel,
  PoiModel,
  CityModel,
  ExtraModel,
  WohnenOfferModel
} from '@integreat-app/integreat-api-client'
import ReactHelmet from 'react-helmet'

import type { Location } from 'redux-first-router'
import { getRouteConfig } from '../../app/route-configs/index'
import type { TFunction } from 'react-i18next'
import compose from 'lodash/fp/compose'
import { withNamespaces } from 'react-i18next'
import CategoriesRouteConfig from '../../app/route-configs/CategoriesRouteConfig'
import { LANDING_ROUTE } from '../../app/route-configs/LandingRouteConfig'
import type { GetPageTitleParamsType } from '../../app/route-configs/RouteConfigInterface'

type PropsType = {|
  getPageTitle: GetPageTitleParamsType => string,
  categories: ?CategoriesMapModel,
  events: ?Array<EventModel>,
  pois: ?Array<PoiModel>,
  cities: ?Array<CityModel>,
  languages: ?Array<LanguageModel>,
  location: Location,
  extras: ?Array<ExtraModel>,
  offers: ?Array<WohnenOfferModel>,
  t: TFunction
|}

export class Helmet extends React.Component<PropsType> {
  getLanguageLinks (): React.Node {
    const {languages, events, pois, categories, location} = this.props
    if (!languages) {
      return null
    }
    return languages.map(language => {
      const path = getRouteConfig(location.type).getLanguageChangePath(
        {events, pois, categories, location, language: language.code})
      return path && <link key={language.code} rel='alternate' hrefLang={language.code} href={path} />
    })
  }

  getMetaDescription (): ?string {
    const {location, t} = this.props
    const {type, pathname} = location
    const {city, language} = location.payload

    if (new CategoriesRouteConfig().getRoutePath({city, language}) === pathname || type === LANDING_ROUTE) {
      return t('metaDescription')
    }
  }

  render () {
    const {getPageTitle, cities, location, pois, events, categories, extras, offers, t} = this.props
    const city = cities && cities.find(city => city.code === location.payload.city)
    const cityName = city ? city.name : ''
    const offerHash = location.payload.offerHash
    const title = getPageTitle({
      t, cityName, pathname: location.pathname, events, categories, pois, extras, offers, offerHash})
    const metaDescription = this.getMetaDescription()

    return <ReactHelmet>
      <title>{title}</title>
      {city && !city.live && <meta name='robots' content='noindex' />}
      {metaDescription && <meta name='description' content={metaDescription} />}
      {this.getLanguageLinks()}
    </ReactHelmet>
  }
}

const mapStateToProps = (state: StateType) => ({
  location: state.location,
  categories: state.categories.data,
  events: state.events.data,
  pois: state.pois.data,
  cities: state.cities.data,
  languages: state.languages.data,
  extras: state.extras.data,
  offers: state.wohnen.data
})

export default compose(
  connect(mapStateToProps),
  withNamespaces('app')
)(Helmet)
