import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { CityModel } from 'api-client'

import Caption from './Caption'
import LanguageSelector from './LanguageSelector'

const ChooseLanguage = styled.p`
  margin: 25px 0;
  text-align: center;
`

type PropsType = {
  cityModel: CityModel
  pathname: string
  languageCode: string
  languageChangePaths: Array<{ code: string; path: string | null; name: string }>
}

const LanguageFailure = ({ cityModel, pathname, languageCode, languageChangePaths }: PropsType): ReactElement => {
  const { t } = useTranslation('error')
  return (
    <>
      <Caption title={cityModel.name} />
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

export default LanguageFailure
