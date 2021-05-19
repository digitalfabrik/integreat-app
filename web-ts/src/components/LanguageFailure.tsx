import React from 'react'
import { withTranslation, TFunction } from 'react-i18next'
import LanguageSelector from './LanguageSelector'
import { CityModel } from 'api-client'
import Caption from './Caption'
import styled from 'styled-components'

const ChooseLanguage = styled.p`
  margin: 25px 0;
  text-align: center;
`

type PropsType = {
  cities: Array<CityModel>
  cityCode: string
  languageChangePaths: Array<{ code: string; path: string | null; name: string }>
  t: TFunction
}

export class LanguageFailure extends React.PureComponent<PropsType> {
  render() {
    const { t, cities, languageChangePaths, cityCode } = this.props
    const title = cities && CityModel.findCityName(cities, cityCode)
    return (
      <>
        {title && <Caption title={title} />}
        <ChooseLanguage>{`${t('notFound.language')} ${t('chooseALanguage')}`}</ChooseLanguage>
        <LanguageSelector isHeaderActionItem={false} location={location} languageChangePaths={languageChangePaths} />
      </>
    )
  }
}

export default withTranslation('error')(LanguageFailure)
