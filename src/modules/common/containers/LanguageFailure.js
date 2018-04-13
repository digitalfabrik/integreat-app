// @flow

import React, { Fragment } from 'react'
import { translate } from 'react-i18next'
import compose from 'lodash/fp/compose'
import { connect } from 'react-redux'

import LanguageSelector from 'modules/common/containers/LanguageSelector'
import CityModel from 'modules/endpoint/models/CityModel'
import Caption from 'modules/common/components/Caption'

import style from './LanguageFailure.css'
import type { I18nTranslate, State } from '../../../flowTypes'

type Props = {
  cities: Array<CityModel>,
  city: string,
  t: I18nTranslate
}

export class LanguageFailure extends React.PureComponent<Props> {
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

const mapStateToProps = (state: State) => ({
  cities: state.cities.data
})

export default compose(
  connect(mapStateToProps),
  translate('error')
)(LanguageFailure)
