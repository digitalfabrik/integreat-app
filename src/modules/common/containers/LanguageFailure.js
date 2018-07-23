// @flow

import React, { Fragment } from 'react'
import { translate } from 'react-i18next'
import compose from 'lodash/fp/compose'
import { connect } from 'react-redux'

import LanguageSelector from 'modules/common/containers/LanguageSelector'
import CityModel from 'modules/endpoint/models/CityModel'
import Caption from 'modules/common/components/Caption'

import style from './LanguageFailure.css'
import type { StateType } from '../../../flowTypes'
import type { TFunction } from 'react-i18next'

type PropsType = {
  cities: Array<CityModel>,
  city: string,
  t: TFunction
}

export class LanguageFailure extends React.PureComponent<PropsType> {
  render () {
    const {t, city, cities} = this.props
    const title = cities && CityModel.findCityName(cities, city)
    return <Fragment>
      {title && <Caption title={title} />}
      <p className={style.chooseLanguage}>
        {`${t('not-found.language')} ${t('chooseYourLanguage')}`}
      </p>
      <LanguageSelector isHeaderActionItem={false} />
    </Fragment>
  }
}

const mapStateTypeToProps = (stateType: StateType) => ({
  cities: stateType.cities.data
})

export default compose(
  connect(mapStateTypeToProps),
  translate('error')
)(LanguageFailure)
