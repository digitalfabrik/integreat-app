import React, { ReactNode } from 'react'
import { TFunction, withTranslation } from 'react-i18next'
import styled from 'styled-components'

import { CityModel } from 'api-client'

import Caption from './Caption'
import LanguageSelector from './LanguageSelector'

const ChooseLanguage = styled.p`
  margin: 25px 0;
  text-align: center;
`

type PropsType = {
  cities: Array<CityModel>
  cityCode: string
  pathname: string
  languageCode: string
  languageChangePaths: Array<{ code: string; path: string | null; name: string }>
  t: TFunction
}

export class LanguageFailure extends React.PureComponent<PropsType> {
  render(): ReactNode {
    const { t, cities, languageChangePaths, cityCode, pathname, languageCode } = this.props
    const title = CityModel.findCityName(cities, cityCode)
    return (
      <>
        {title && <Caption title={title} />}
        <ChooseLanguage>{`${t('notFound.language')} ${t('chooseALanguage')}`}</ChooseLanguage>
        <LanguageSelector
          isHeaderActionItem={false}
          pathname={pathname}
          languageCode={languageCode}
          languageChangePaths={languageChangePaths}
        />
      </>
    )
  }
}

export default withTranslation('error')(LanguageFailure)
