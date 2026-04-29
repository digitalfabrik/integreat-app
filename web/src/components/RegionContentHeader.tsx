import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { regionContentPath, pathnameFromRouteInformation, SEARCH_ROUTE } from 'shared'
import { CategoryModel, RegionModel } from 'shared/api'

import useDimensions from '../hooks/useDimensions'
import Header from './Header'
import HeaderActionItem from './HeaderActionItem'
import HeaderLanguageSelectorItem from './HeaderLanguageSelectorItem'
import { LanguageChangePath } from './LanguageList'
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

  const params = { regionCode: regionModel.code, languageCode }
  const categoriesPath = regionContentPath(params)
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
    <RegionContentMenu key='sidebar' category={category} pageTitle={pageTitle} fitScreen={fitScreen} />,
  ].filter(Boolean)

  return (
    <Header
      logoHref={categoriesPath}
      actionItems={actionItems}
      regionName={regionModel.name}
      language={languageCode}
      TabBar={desktop && <NavigationTabs regionModel={regionModel} languageCode={languageCode} />}
    />
  )
}

export default RegionContentHeader
