// @flow

import React, { Fragment } from 'react'
import { translate } from 'react-i18next'
import compose from 'lodash/fp/compose'
import { connect } from 'react-redux'

import LanguageSelector from 'modules/common/containers/LanguageSelector'
import setLanguageChangeUrls from 'modules/language/actions/setLanguageChangeUrls'
import LanguageModel from 'modules/endpoint/models/LanguageModel'
import LocationModel from 'modules/endpoint/models/LocationModel'
import Caption from 'modules/common/components/Caption'

import style from './LanguageFailure.css'

type mapLanguageToPath = string => string

type Props = {
  locations: Array<LocationModel>,
  languages: Array<LanguageModel>,
  location: string,
  setLanguageChangeUrls: (mapLanguageToPath, Array<LanguageModel>) => void,
  t: string => string
}

export class LanguageFailure extends React.PureComponent<Props> {
  /**
   * The function used to map different languages to their CategoriesPage
   * @param {string} language The language
   * @returns {string} The url of the CategoriesPage of a different language
   */
  mapLanguageToUrl = (language: string) => `/${this.props.location}/${language}`

  /**
   * Gets and stores the available languages for the current page
   */
  setLanguageChangeUrls () {
    this.props.setLanguageChangeUrls(this.mapLanguageToUrl, this.props.languages)
  }

  componentWillMount () {
    this.setLanguageChangeUrls()
  }

  getTitle (): ?string {
    const location = this.props.locations.find(location => location.code === this.props.location)
    if (location) {
      return location.name
    }
  }

  render () {
    const {languages, t} = this.props
    return <Fragment>
      <Caption title={this.getTitle()} />
      <p className={style.chooseLanguage}>{t('common:chooseYourLanguage')}</p>
      <LanguageSelector languages={languages} verticalLayout />
    </Fragment>
  }
}

const mapDispatchToProps = dispatch => ({
  setLanguageChangeUrls: (mapLanguageToUrl, languages) => dispatch(setLanguageChangeUrls(mapLanguageToUrl, languages))
})

const mapStateToProps = state => ({
  location: state.router.params.location
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  translate('common')
)(LanguageFailure)
