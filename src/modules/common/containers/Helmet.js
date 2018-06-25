// @flow

import React from 'react'
import type { State } from '../../../flowTypes'
import { connect } from 'react-redux'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'
import EventModel from '../../endpoint/models/EventModel'
import LanguageModel from '../../endpoint/models/LanguageModel'
import ReactHelmet from 'react-helmet'

import type { Location } from 'redux-first-router/dist/flow-types'
import getLanguageChangePath from '../../app/getLanguageChangePath'

type Props = {
  title: string,
  categories: CategoriesMapModel,
  events: Array<EventModel>,
  languages: Array<LanguageModel>,
  location: Location,
  metaDescription: ?string
}

export class Helmet extends React.Component<Props> {
  getLanguageLinks () {
    const {languages, events, categories, location} = this.props
    return languages && languages
      .map(language => {
        const path = getLanguageChangePath({events, categories, languageCode: language.code, location})
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

const mapStateToProps = (state: State) => ({
  location: state.location,
  categories: state.categories.data,
  events: state.events.data,
  languages: state.languages.data
})

export default connect(mapStateToProps)(Helmet)
