// @flow

import * as React from 'react'
import type { StateType } from '../../app/StateType'
import { connect } from 'react-redux'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'
import EventModel from '../../endpoint/models/EventModel'
import LanguageModel from '../../endpoint/models/LanguageModel'
import ReactHelmet from 'react-helmet'

import type { Location } from 'redux-first-router'
import PoiModel from '../../endpoint/models/PoiModel'
import CityModel from '../../endpoint/models/CityModel'

type PropsType = {|
  title: string,
  categories: CategoriesMapModel,
  events: Array<EventModel>,
  pois: Array<PoiModel>,
  cities: Array<CityModel>,
  languages: Array<LanguageModel>,
  location: Location,
  metaDescription?: string
|}

export class Helmet extends React.Component<PropsType> {
  getLanguageLinks (): React.Node {
    const {languages, events, pois, categories, location} = this.props
    return languages && languages
      .map(language => {
        const path = getLanguageChangePath[location.type]({
          events,
          pois,
          categories,
          city: location.payload.city,
          language: language.code,
          location
        })
        return <link key={language.code} rel='alternate' hrefLang={language.code} href={path} />
      })
  }

  render () {
    const { title, metaDescription, cities, location } = this.props
    const city = cities && cities.find(city => city.code === location.payload.city)

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

export default connect(mapStateToProps)(Helmet)
