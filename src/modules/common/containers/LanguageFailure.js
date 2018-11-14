// @flow

import React from 'react'
import type { TFunction } from 'react-i18next'
import { translate } from 'react-i18next'
import compose from 'lodash/fp/compose'
import { connect } from 'react-redux'

import LanguageSelector from '../../../modules/common/containers/LanguageSelector'
import { CityModel } from '@integreat-app/integreat-api-client'
import Caption from '../../../modules/common/components/Caption'

import styled from 'styled-components'
import type { StateType } from '../../app/StateType'

const ChooseLanguage = styled.p`
  margin: 25px 0;
  text-align: center;
`

type PropsType = {|
  cities: Array<CityModel>,
  city: string,
  t: TFunction
|}

export class LanguageFailure extends React.PureComponent<PropsType> {
  render () {
    const {t, city, cities} = this.props
    const title = cities && CityModel.findCityName(cities, city)
    return <>
      {title && <Caption title={title} />}
      <ChooseLanguage>{`${t('not-found.language')} ${t('chooseYourLanguage')}`}</ChooseLanguage>
      <LanguageSelector isHeaderActionItem={false} />
    </>
  }
}

const mapStateTypeToProps = (stateType: StateType) => ({
  cities: stateType.cities.data
})

export default compose(
  connect(mapStateTypeToProps),
  translate('error')
)(LanguageFailure)
