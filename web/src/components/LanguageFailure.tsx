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

type LanguageFailureProps = {
  cityModel: CityModel
  languageCode: string
  languageChangePaths: Array<{ code: string; path: string | null; name: string }>
}

const LanguageFailure = ({ cityModel, languageCode, languageChangePaths }: LanguageFailureProps): ReactElement => {
  const { t } = useTranslation('error')
  return (
    <>
      <Caption title={cityModel.name} />
      <ChooseLanguage>{`${t('notFound.language')} ${t('chooseALanguage')}`}</ChooseLanguage>
      <LanguageSelector
        isHeaderActionItem={false}
        languageCode={languageCode}
        languageChangePaths={languageChangePaths}
      />
    </>
  )
}

export default LanguageFailure
