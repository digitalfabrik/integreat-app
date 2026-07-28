import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { regionContentPath, pathnameFromRouteInformation, SEARCH_ROUTE } from 'shared'
import { CategoryModel, RegionModel } from 'shared/api'

import useDimensions from '../hooks/useDimensions'
import Header from './Header'
import HeaderActionItem from './HeaderActionItem'
import HeaderLanguageSelectorItem from './HeaderLanguageSelectorItem'
import { LanguageChangePath } from './LanguageSelection'
import LiveAnnouncer from './LiveAnnouncer'
import NavigationTabs from './NavigationTabs'
import RegionContentMenu from './RegionContentMenu'

type RegionContentHeaderProps = {
  regionModel: RegionModel
  languageCode: string
  languageChangePaths: LanguageChangePath[] | null
  category?: CategoryModel
  pageTitle: string | null
  fitScreen?: boolean
}

const RegionContentHeader = ({
  regionModel,
  languageCode,
  languageChangePaths,
  category,
  pageTitle,
  fitScreen,
}: RegionContentHeaderProps): ReactElement => {
  const { t } = useTranslation('layout')
  const prevLanguage = useRef(languageCode)
  const [announcement, setAnnouncement] = useState('')

  const params = { regionCode: regionModel.code, languageCode }
  const categoriesPath = regionContentPath(params)
  const searchPath = pathnameFromRouteInformation({ route: SEARCH_ROUTE, ...params })
  const { desktop } = useDimensions()

  useEffect(() => {
    if (prevLanguage.current !== languageCode) {
      const languageName = languageChangePaths?.find(l => l.code === languageCode)?.name ?? languageCode
      setAnnouncement(`${t('languageChangedTo')} ${languageName}`)
      prevLanguage.current = languageCode
    }
  }, [languageCode, languageChangePaths, t])

  const actionItems = [
    <HeaderActionItem key='search' to={searchPath} text={t('search')} icon={<SearchOutlinedIcon />} />,
    languageChangePaths ? (
      <HeaderLanguageSelectorItem
        key='languageChange'
        languageChangePaths={languageChangePaths}
        languageCode={languageCode}
        feedbackAvailable
      />
    ) : null,
    <RegionContentMenu key='sidebar' category={category} pageTitle={pageTitle} fitScreen={fitScreen} />,
  ].filter(Boolean)

  return (
    <>
      <LiveAnnouncer message={announcement} />
      <Header
        logoHref={categoriesPath}
        actionItems={actionItems}
        regionName={regionModel.name}
        language={languageCode}
        tabBar={desktop && <NavigationTabs regionModel={regionModel} languageCode={languageCode} />}
      />
    </>
  )
}

export default RegionContentHeader
