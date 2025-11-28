import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { CityModel } from 'shared/api'

import LanguageList, { LanguageChangePath } from './LanguageList'
import H1 from './base/H1'

const ChooseLanguage = styled('p')`
  margin: 25px 0;
  text-align: center;
`

type LanguageFailureProps = {
  cityModel: CityModel
  languageCode: string
  languageChangePaths: LanguageChangePath[]
}

const LanguageFailure = ({ cityModel, languageCode, languageChangePaths }: LanguageFailureProps): ReactElement => {
  const { t } = useTranslation('error')
  return (
    <>
      <H1>{cityModel.name}</H1>
      <ChooseLanguage>{t('notFound.language')}</ChooseLanguage>
      <LanguageList languageCode={languageCode} languageChangePaths={languageChangePaths} availableOnly />
    </>
  )
}

export default LanguageFailure
