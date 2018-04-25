// @flow

import React from 'react'
import type { State } from '../../../flowTypes'
import { connect } from 'react-redux'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'
import EventModel from '../../endpoint/models/EventModel'
import LanguageModel from '../../endpoint/models/LanguageModel'
import { LanguageSelector } from './LanguageSelector'
import ReactHelmet from 'react-helmet'

import type { Location } from 'redux-first-router/dist/flow-types'

type Props = {
  title: string,
  categories: CategoriesMapModel,
  events: Array<EventModel>,
  languages: Array<LanguageModel>,
  location: Location
}

export class Helmet extends React.Component<Props> {
  getLanguageLinks () {
    const {languages, events, categories, location} = this.props
    return languages && languages
      .map(language => {
        const path = LanguageSelector.getLanguageChangPath({events, categories, languageCode: language.code, location})
        return <link rel='alternate' hrefLang={language.code} href={path} />
      })
  }

  render () {
    const title = this.props.title
    return <ReactHelmet>
      <title>{title}</title>
      {this.getLanguageLinks()}
    </ReactHelmet>
  }
}

const mapStateToProps = (state: State) => ({
  location: state.location,
  categories: state.categories.data,
  events: state.events.data,
  languages: state.languages.data
})

export default connect(mapStateToProps)(Helmet)
