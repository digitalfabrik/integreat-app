import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { RegionModel } from 'shared/api'

import LanguageList, { LanguageChangePath } from './LanguageList'
import H1 from './base/H1'

const ChooseLanguage = styled('p')`
  margin: 25px 0;
  text-align: center;
`

type LanguageFailureProps = {
  regionModel: RegionModel
  languageCode: string
  languageChangePaths: LanguageChangePath[]
}

const LanguageFailure = ({ regionModel, languageCode, languageChangePaths }: LanguageFailureProps): ReactElement => {
  const { t } = useTranslation('error')
  return (
    <>
      <H1>{regionModel.name}</H1>
      <ChooseLanguage>{t('notFound.language')}</ChooseLanguage>
      <LanguageList languageCode={languageCode} languageChangePaths={languageChangePaths} availableOnly asList />
    </>
  )
}

export default LanguageFailure
