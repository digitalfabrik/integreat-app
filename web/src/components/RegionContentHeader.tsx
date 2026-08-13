import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import Stack from '@mui/material/Stack'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { regionContentPath, pathnameFromRouteInformation, SEARCH_ROUTE } from 'shared'
import { CategoryModel, RegionModel } from 'shared/api'

import { HEADER_ACTIONS_ELEMENT_ID } from '../constants/layout'
import useDimensions from '../hooks/useDimensions'
import Header from './Header'
import HeaderActionItem from './HeaderActionItem'
import HeaderLanguageSelectorItem from './HeaderLanguageSelectorItem'
import { LanguageChangePath } from './LanguageSelection'
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
  const { t } = useTranslation()

  const params = { regionCode: regionModel.code, languageCode }
  const categoriesPath = regionContentPath(params)
  const searchPath = pathnameFromRouteInformation({ route: SEARCH_ROUTE, ...params })
  const { desktop } = useDimensions()

  const actionItems = [
    <Stack key='searchAndLanguage' id={HEADER_ACTIONS_ELEMENT_ID} direction='row' alignItems='center' gap={1}>
      <HeaderActionItem to={searchPath} text={t($ => $.layout.search)} icon={<SearchOutlinedIcon />} />
      {!!languageChangePaths && (
        <HeaderLanguageSelectorItem
          languageChangePaths={languageChangePaths}
          languageCode={languageCode}
          feedbackAvailable
        />
      )}
    </Stack>,
    <RegionContentMenu key='sidebar' category={category} pageTitle={pageTitle} fitScreen={fitScreen} />,
  ]

  return (
    <Header
      logoHref={categoriesPath}
      actionItems={actionItems}
      regionName={regionModel.name}
      language={languageCode}
      tabBar={desktop && <NavigationTabs regionModel={regionModel} languageCode={languageCode} />}
    />
  )
}

export default RegionContentHeader
