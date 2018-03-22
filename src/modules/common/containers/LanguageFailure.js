// @flow

import React, { Fragment } from 'react'
import { translate } from 'react-i18next'
import compose from 'lodash/fp/compose'
import { connect } from 'react-redux'

import LanguageSelector from 'modules/common/containers/LanguageSelector'
import LanguageModel from 'modules/endpoint/models/LanguageModel'
import CityModel from 'modules/endpoint/models/CityModel'
import Caption from 'modules/common/components/Caption'

import style from './LanguageFailure.css'

type Props = {
  locations: Array<CityModel>,
  languages: Array<LanguageModel>,
  location: string,
  t: string => string
}

export class LanguageFailure extends React.PureComponent<Props> {
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

const mapStateToProps = state => ({
  location: state.router.params.location
})

export default compose(
  connect(mapStateToProps),
  translate('common')
)(LanguageFailure)
