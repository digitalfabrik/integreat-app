import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { cityContentPath, LANDING_ROUTE, pathnameFromRouteInformation, SEARCH_ROUTE } from 'shared'
import { CityModel } from 'shared/api'

import ContrastThemeToggle from './ContrastThemeToggle'
import Header from './Header'
import HeaderActionItem from './HeaderActionItem'
import HeaderLanguageSelectorItem from './HeaderLanguageSelectorItem'
import NavigationTabs from './NavigationTabs'
import SidebarActionItem from './SidebarActionItem'
import Link from './base/Link'

type CityContentHeaderProps = {
  cityModel: CityModel
  languageCode: string
  languageChangePaths: { code: string; path: string | null; name: string }[] | null
}

const CityContentHeader = ({ cityModel, languageCode, languageChangePaths }: CityContentHeaderProps): ReactElement => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { t } = useTranslation('layout')

  const params = { cityCode: cityModel.code, languageCode }
  const categoriesPath = cityContentPath(params)
  const searchPath = pathnameFromRouteInformation({ route: SEARCH_ROUTE, ...params })
  const landingPath = pathnameFromRouteInformation({ route: LANDING_ROUTE, ...{ languageCode } })

  const SearchActionItem = (
    <HeaderActionItem key='search' to={searchPath} text={t('search')} icon={<SearchOutlinedIcon />} />
  )

  const LanguageSelectorActionItem = (
    <HeaderLanguageSelectorItem
      key='languageChange'
      languageChangePaths={languageChangePaths}
      languageCode={languageCode}
    />
  )

  const actionItems = [SearchActionItem, LanguageSelectorActionItem]

  const sidebarItems = [
    <Link key='location' to={landingPath}>
      <SidebarActionItem text={t('changeLocation')} iconSrc={LocationOnOutlinedIcon} />
    </Link>,
    <ContrastThemeToggle key='contrastTheme' />,
  ]

  return (
    <Header
      logoHref={categoriesPath}
      actionItems={actionItems}
      sidebarItems={sidebarItems}
      cityName={cityModel.name}
      cityCode={cityModel.code}
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      language={languageCode}
      TabBar={<NavigationTabs cityModel={cityModel} languageCode={languageCode} />}
    />
  )
}

export default CityContentHeader
