import ContrastIcon from '@mui/icons-material/Contrast'
import { useTheme } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'

import { LANDING_ROUTE, pathnameFromRouteInformation } from 'shared'
import { LanguageModel } from 'shared/api'

import { supportedLanguages } from '../utils'
import Header from './Header'
import HeaderLanguageSelectorItem from './HeaderLanguageSelectorItem'
import Sidebar from './Sidebar'
import SidebarActionItem from './SidebarActionItem'

type GeneralHeaderProps = {
  languageCode: string
  cityLanguages?: LanguageModel[]
  onStickyTopChanged?: (stickyTop: number) => void
}

const GeneralHeader = ({ languageCode, cityLanguages, onStickyTopChanged }: GeneralHeaderProps): ReactElement => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { toggleTheme } = useTheme()
  const { t } = useTranslation('layout')
  const slug = useLocation().pathname.split('/')[1]

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
    <Sidebar key='sidebar' setOpen={setSidebarOpen} open={sidebarOpen}>
      <SidebarActionItem key='theme' text={t('contrastTheme')} icon={<ContrastIcon />} onClick={toggleTheme} />
    </Sidebar>,
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
