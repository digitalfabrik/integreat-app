// @flow

import * as React from 'react'
import type { StateType } from '../../app/StateType'
import { connect } from 'react-redux'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'
import EventModel from '../../endpoint/models/EventModel'
import LanguageModel from '../../endpoint/models/LanguageModel'
import ReactHelmet from 'react-helmet'

import type { Location } from 'redux-first-router'
import { getRouteConfig } from '../../app/routes/routeConfigs/index'
import PoiModel from '../../endpoint/models/PoiModel'
import CityModel from '../../endpoint/models/CityModel'
import type { GetPageTitleParamsType } from '../../app/routes/types'
import type { TFunction } from 'react-i18next'
import compose from 'lodash/fp/compose'
import { translate } from 'react-i18next'
import { LANDING_ROUTE } from '../../app/routes/landing'
import { getCategoriesPath } from '../../app/routes/categories'

type PropsType = {|
  getPageTitle: GetPageTitleParamsType => string,
  categories: CategoriesMapModel,
  events: Array<EventModel>,
  pois: Array<PoiModel>,
  cities: Array<CityModel>,
  languages: Array<LanguageModel>,
  location: Location,
  t: TFunction
|}

export class Helmet extends React.Component<PropsType> {
  getLanguageLinks (): React.Node {
    const {languages, events, pois, categories, location} = this.props
    return languages && languages.map(language => {
      const path = getRouteConfig(location.type).getLanguageChangePath(
        {events, pois, categories, location, language: language.code})
      return path && <link key={language.code} rel='alternate' hrefLang={language.code} href={path} />
    })
  }

  getMetaDescription (): ?string {
    const {location, t} = this.props
    const {type, pathname} = location
    const {city, language} = location.payload

    if (getCategoriesPath({city, language}) === pathname || type === LANDING_ROUTE) {
      return t('metaDescription')
    }
  }

  render () {
    const { getPageTitle, cities, location, pois, events, categories, t } = this.props
    const city = cities && cities.find(city => city.code === location.payload.city)
    const cityName = city ? city.name : ''
    const title = getPageTitle({t, cityName, pathname: location.pathname, events, categories, pois})
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
  languages: state.languages.data
})

export default compose(
  connect(mapStateToProps),
  translate('app')
)(Helmet)
