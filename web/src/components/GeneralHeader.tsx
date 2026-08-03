import ContrastIcon from '@mui/icons-material/Contrast'
import { useTheme } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'

import { REGIONS_ROUTE, pathnameFromRouteInformation } from 'shared'
import { LanguageModel } from 'shared/api'

import useAnnounceLanguageChange from '../hooks/useAnnounceLanguageChange'
import { supportedLanguages } from '../utils'
import Header from './Header'
import HeaderLanguageSelectorItem from './HeaderLanguageSelectorItem'
import HeaderMenu from './HeaderMenu'
import LiveAnnouncer from './LiveAnnouncer'
import MenuItem from './MenuItem'

type GeneralHeaderProps = {
  languageCode: string
  regionLanguages?: LanguageModel[]
}

const GeneralHeader = ({ languageCode, regionLanguages }: GeneralHeaderProps): ReactElement => {
  const slug = useLocation().pathname.split('/')[1]
  const { toggleTheme } = useTheme()
  const { t } = useTranslation('layout')

  const regionsPath = pathnameFromRouteInformation({ route: REGIONS_ROUTE, languageCode })
  const languageChangePaths = (regionLanguages ?? supportedLanguages).map(language => ({
    code: language.code,
    name: language.name,
    path: `/${slug}/${language.code}`,
  }))

  const announcement = useAnnounceLanguageChange(languageCode, languageChangePaths, t)

  const actionItems = [
    languageChangePaths.length > 0 ? (
      <HeaderLanguageSelectorItem
        key='languageChange'
        languageChangePaths={languageChangePaths}
        languageCode={languageCode}
        forceText
      />
    ) : null,
    <HeaderMenu key='menu' pageTitle={null}>
      <MenuItem key='theme' text={t('contrastTheme')} icon={<ContrastIcon fontSize='small' />} onClick={toggleTheme} />
    </HeaderMenu>,
  ]

  return (
    <>
      <LiveAnnouncer message={announcement} />
      <Header logoHref={regionsPath} actionItems={actionItems} language={languageCode} />
    </>
  )
}

export default GeneralHeader
