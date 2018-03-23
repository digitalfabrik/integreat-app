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
  cities: Array<CityModel>,
  languages: Array<LanguageModel>,
  city: string,
  t: string => string
}

export class LanguageFailure extends React.PureComponent<Props> {
  getTitle (): ?string {
    const city = this.props.cities.find(city => city.code === this.props.city)
    if (city) {
      return city.name
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
  city: state.router.params.city
})

export default compose(
  connect(mapStateToProps),
  translate('common')
)(LanguageFailure)
