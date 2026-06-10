import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  NEWS_ALL_SOURCES_FILTER,
  NEWS_SOURCE_FILTERS,
  NEWS_ROUTE,
  NewsSourceFilter,
  pathnameFromRouteInformation,
} from 'shared'
import { createNewsEndpoint, loadFromEndpoint, NewsModel } from 'shared/api'

import Helmet from '../components/Helmet'
import InfiniteScrollList from '../components/InfiniteScrollList'
import NewsListItem from '../components/NewsListItem'
import RegionContentLayout, { RegionContentLayoutProps } from '../components/RegionContentLayout'
import RegionContentToolbar from '../components/RegionContentToolbar'
import ToggleTextButtonGroup from '../components/ToggleTextButtonGroup'
import H1 from '../components/base/H1'
import { cmsApiBaseUrl } from '../constants/urls'
import useDimensions from '../hooks/useDimensions'
import { RegionRouteProps } from './index'

const FilterHint = styled(Typography)({
  paddingInlineStart: 16,
})

const NewsPage = ({ languageCode, regionCode, region }: RegionRouteProps): ReactElement | null => {
  const [newsSource, setNewsSource] = useState<NewsSourceFilter>(NEWS_ALL_SOURCES_FILTER)
  const { desktop } = useDimensions()
  const { t } = useTranslation('news')

  const loadNews = useCallback(
    (page: number) =>
      loadFromEndpoint(createNewsEndpoint, cmsApiBaseUrl, {
        region: regionCode,
        language: languageCode,
        page,
        newsSources: newsSource,
      }),
    [regionCode, languageCode, newsSource],
  )

  if (!region) {
    return null
  }

  const languageChangePaths = region.languages.map(({ code, name }) => ({
    path: pathnameFromRouteInformation({ route: NEWS_ROUTE, regionCode, languageCode: code }),
    name,
    code,
  }))

  const pageTitle = `${t('news')} - ${region.name}`
  const locationLayoutParams: Omit<RegionContentLayoutProps, 'isLoading'> = {
    region,
    languageChangePaths,
    languageCode,
    pageTitle,
    Toolbar: <RegionContentToolbar />,
  }

  const getLabel = (value: NewsSourceFilter): string => t(desktop ? `${value}News` : value)

  return (
    <RegionContentLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} regionModel={region} />
      <H1>{t('news')}</H1>
      <Stack gap={2}>
        <FilterHint variant='body2' color='textSecondary'>
          {t('common:filter')}
        </FilterHint>
        <ToggleTextButtonGroup
          setValue={setNewsSource}
          values={NEWS_SOURCE_FILTERS}
          value={newsSource}
          getLabel={getLabel}
        />
        <InfiniteScrollList
          request={loadNews}
          renderItem={(news: NewsModel) => (
            <NewsListItem key={news.id} news={news} regionCode={regionCode} languageCode={languageCode} />
          )}
          noItemsMessage='news:currentlyNoNews'
        />
      </Stack>
    </RegionContentLayout>
  )
}

export default NewsPage
