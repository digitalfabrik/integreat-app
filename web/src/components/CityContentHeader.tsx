import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { cityContentPath, pathnameFromRouteInformation, SEARCH_ROUTE } from 'shared'
import { CategoryModel, CityModel } from 'shared/api'

import useDimensions from '../hooks/useDimensions'
import CityContentMenu from './CityContentMenu'
import Header from './Header'
import HeaderActionItem from './HeaderActionItem'
import HeaderLanguageSelectorItem from './HeaderLanguageSelectorItem'
import { LanguageChangePath } from './LanguageList'
import NavigationTabs from './NavigationTabs'

type CityContentHeaderProps = {
  cityModel: CityModel
  languageCode: string
  languageChangePaths: LanguageChangePath[] | null
  category?: CategoryModel
  pageTitle: string | null
  fitScreen?: boolean
}

const CityContentHeader = ({
  cityModel,
  languageCode,
  languageChangePaths,
  category,
  pageTitle,
  fitScreen,
}: CityContentHeaderProps): ReactElement => {
  const { t } = useTranslation('layout')

  const params = { cityCode: cityModel.code, languageCode }
  const categoriesPath = cityContentPath(params)
  const searchPath = pathnameFromRouteInformation({ route: SEARCH_ROUTE, ...params })
  const { desktop } = useDimensions()

  const actionItems = [
    <HeaderActionItem key='search' to={searchPath} text={t('search')} icon={<SearchOutlinedIcon />} />,
    languageChangePaths ? (
      <HeaderLanguageSelectorItem
        key='languageChange'
        languageChangePaths={languageChangePaths}
        languageCode={languageCode}
      />
    ) : null,
    <CityContentMenu key='sidebar' category={category} pageTitle={pageTitle} fitScreen={fitScreen} />,
  ].filter(Boolean)

  return (
    <Header
      logoHref={categoriesPath}
      actionItems={actionItems}
      cityName={cityModel.name}
      language={languageCode}
      TabBar={desktop && <NavigationTabs cityModel={cityModel} languageCode={languageCode} />}
    />
  )
}

export default CityContentHeader
