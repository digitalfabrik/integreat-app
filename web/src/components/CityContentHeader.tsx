import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { cityContentPath, pathnameFromRouteInformation, SEARCH_ROUTE } from 'shared'
import { CategoryModel, CityModel } from 'shared/api'

import useDimensions from '../hooks/useDimensions'
import CityContentSidebar from './CityContentSidebar'
import Header from './Header'
import HeaderActionItem from './HeaderActionItem'
import HeaderLanguageSelectorItem from './HeaderLanguageSelectorItem'
import NavigationTabs from './NavigationTabs'

type CityContentHeaderProps = {
  cityModel: CityModel
  languageCode: string
  languageChangePaths: { code: string; path: string | null; name: string }[] | null
  category?: CategoryModel
}

const CityContentHeader = ({
  cityModel,
  languageCode,
  languageChangePaths,
  category,
}: CityContentHeaderProps): ReactElement => {
  const { t } = useTranslation('layout')

  const params = { cityCode: cityModel.code, languageCode }
  const categoriesPath = cityContentPath(params)
  const searchPath = pathnameFromRouteInformation({ route: SEARCH_ROUTE, ...params })
  const { mobile } = useDimensions()

  const actionItems = [
    <HeaderActionItem key='search' to={searchPath} text={t('search')} icon={<SearchOutlinedIcon />} />,
    <HeaderLanguageSelectorItem
      key='languageChange'
      languageChangePaths={languageChangePaths}
      languageCode={languageCode}
    />,
    mobile ? <CityContentSidebar key='sidebar' category={category} /> : null,
  ]

  return (
    <Header
      logoHref={categoriesPath}
      actionItems={actionItems}
      cityName={cityModel.name}
      language={languageCode}
      TabBar={!mobile && <NavigationTabs cityModel={cityModel} languageCode={languageCode} />}
    />
  )
}

export default CityContentHeader
