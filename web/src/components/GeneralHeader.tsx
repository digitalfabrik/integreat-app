import ContrastIcon from '@mui/icons-material/Contrast'
import { useTheme } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import { LANDING_ROUTE, pathnameFromRouteInformation } from 'shared'
import { LanguageModel } from 'shared/api'

import { supportedLanguages } from '../utils'
import Header from './Header'
import HeaderLanguageSelectorItem from './HeaderLanguageSelectorItem'
import HeaderMenu from './HeaderMenu'
import MenuItem from './MenuItem'

type GeneralHeaderProps = {
  languageCode: string
  cityLanguages?: LanguageModel[]
  onStickyTopChanged?: (stickyTop: number) => void
}

const GeneralHeader = ({ languageCode, cityLanguages, onStickyTopChanged }: GeneralHeaderProps): ReactElement => {
  const slug = useLocation().pathname.split('/')[1]
  const { toggleTheme } = useTheme()
  const { t } = useTranslation('layout')

  const landingPath = pathnameFromRouteInformation({ route: LANDING_ROUTE, languageCode })
  const languageChangePaths = (cityLanguages ?? supportedLanguages).map(language => ({
    code: language.code,
    name: language.name,
    path: `/${slug}/${language.code}`,
  }))

  const actionItems = [
    languageChangePaths.length > 0 ? (
      <HeaderLanguageSelectorItem
        key='languageChange'
        languageChangePaths={languageChangePaths}
        languageCode={languageCode}
        forceText
      />
    ) : null,
    <HeaderMenu key='menu'>
      <MenuItem key='theme' text={t('contrastTheme')} icon={<ContrastIcon fontSize='small' />} onClick={toggleTheme} />
    </HeaderMenu>,
  ]

  return (
    <Header
      logoHref={landingPath}
      actionItems={actionItems}
      language={languageCode}
      onStickyTopChanged={onStickyTopChanged}
    />
  )
}

export default GeneralHeader
