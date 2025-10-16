import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { CityModel } from 'shared/api'

import Caption from './Caption'
import LanguageSelector, { LanguageChangePath } from './LanguageSelector'

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
      <Caption title={cityModel.name} />
      <ChooseLanguage>{t('notFound.language')}</ChooseLanguage>
      <LanguageSelector languageCode={languageCode} languageChangePaths={languageChangePaths} availableOnly />
    </>
  )
}

export default LanguageFailure
