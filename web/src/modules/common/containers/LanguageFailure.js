// @flow

import React from 'react'
import { withTranslation, TFunction } from 'react-i18next'
import LanguageSelector from '../../../modules/common/containers/LanguageSelector'
import { CityModel } from 'api-client'
import Caption from '../../../modules/common/components/Caption'
import type { LocationState } from 'redux-first-router'
import styled, { withTheme } from 'styled-components'
import type { LanguageChangePathsType } from '../../app/containers/Switcher'
import type { ThemeType } from '../../theme/constants/theme'

const ChooseLanguage = styled.p`
  margin: 25px 0;
  text-align: center;
`

type PropsType = {|
  cities: Array<CityModel>,
  theme: ThemeType,
  location: LocationState,
  languageChangePaths: LanguageChangePathsType,
  t: typeof TFunction
|}

export class LanguageFailure extends React.PureComponent<PropsType> {
  render () {
    const { t, location, cities, languageChangePaths, theme } = this.props
    const title = cities && CityModel.findCityName(cities, location.payload.city)
    return <>
      {title && <Caption title={title} />}
      <ChooseLanguage>{`${t('notFound.language')} ${t('chooseALanguage')}`}</ChooseLanguage>
      <LanguageSelector isHeaderActionItem={false} location={location} languageChangePaths={languageChangePaths}
                        theme={theme} />
    </>
  }
}

export default withTheme(withTranslation('error')(LanguageFailure))
