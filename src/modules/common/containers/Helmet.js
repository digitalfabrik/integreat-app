// @flow

import * as React from 'react'
import type { StateType } from '../../app/StateType'
import { connect } from 'react-redux'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'
import EventModel from '../../endpoint/models/EventModel'
import LanguageModel from '../../endpoint/models/LanguageModel'
import ReactHelmet from 'react-helmet'

import type { Location } from 'redux-first-router'
import getLanguageChangePath from '../../app/getLanguageChangePath'
import PoiModel from '../../endpoint/models/PoiModel'

type PropsType = {|
  title: string,
  categories: CategoriesMapModel,
  events: Array<EventModel>,
  pois: Array<PoiModel>,
  languages: Array<LanguageModel>,
  location: Location,
  metaDescription?: string
|}

export class Helmet extends React.Component<PropsType> {
  getLanguageLinks (): React.Node {
    const {languages, events, pois, categories, location} = this.props
    return languages && languages
      .map(language => {
        const path = getLanguageChangePath({events, pois, categories, languageCode: language.code, location})
        return <link key={language.code} rel='alternate' hrefLang={language.code} href={path} />
      })
  }

  render () {
    const { title, metaDescription } = this.props
    return <ReactHelmet>
      <title>{title}</title>
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
  languages: state.languages.data
})

export default connect(mapStateToProps)(Helmet)
