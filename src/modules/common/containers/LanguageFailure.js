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
  language: string,
  t: string => string
}

export class LanguageFailure extends React.PureComponent<Props> {
  render () {
    const {languages, t, language, city, cities} = this.props
    const title = cities && CityModel.findCityName(cities, city)
    // todo design and translate
    return <Fragment>
      {title && <Caption title={title} />}
      <p className={style.chooseLanguage}>
        {`Your language ${language} is not available here. ${t('common:chooseYourLanguage')}`}
      </p>
      <LanguageSelector languages={languages} verticalLayout />
    </Fragment>
  }
}

const mapStateToProps = state => ({
  languages: state.languages.data,
  cities: state.cities.data
})

export default compose(
  connect(mapStateToProps),
  translate('common')
)(LanguageFailure)
