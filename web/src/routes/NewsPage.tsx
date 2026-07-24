import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  NEWS_ALL_SOURCES_FILTER,
  NEWS_SOURCE_FILTERS,
  NEWS_ROUTE,
  NewsSourceFilter,
  pathnameFromRouteInformation,
  newsFilterToSources,
} from 'shared'
import { createNewsEndpoint } from 'shared/api'

import Helmet from '../components/Helmet'
import NewsListItem from '../components/NewsListItem'
import RegionContentLayout, { RegionContentLayoutProps } from '../components/RegionContentLayout'
import SkeletonList from '../components/SkeletonList'
import ToggleTextButtonGroup from '../components/ToggleTextButtonGroup'
import H1 from '../components/base/H1'
import List from '../components/base/List'
import { cmsApiBaseUrl } from '../constants/urls'
import useDimensions from '../hooks/useDimensions'
import useQueryFromEndpoint from '../hooks/useQueryFromEndpoint'
import { RegionRouteProps } from './index'

const NewsSourceFilterButtonGroup = styled(ToggleTextButtonGroup)({
  paddingInline: 16,
}) as typeof ToggleTextButtonGroup

const NewsPage = ({ languageCode, regionCode, region }: RegionRouteProps): ReactElement | null => {
  const [newsSourceFilter, setNewsSourceFilter] = useState<NewsSourceFilter>(NEWS_ALL_SOURCES_FILTER)
  const { desktop } = useDimensions()
  const { t } = useTranslation('news')

  const { data, ...response } = useQueryFromEndpoint(createNewsEndpoint, cmsApiBaseUrl, {
    region: regionCode,
    language: languageCode,
  })

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
    slug: null,
  }

  const newsSources = newsFilterToSources(newsSourceFilter)
  const news = data?.filter(news => !newsSources || newsSources.includes(news.source))
  const newsListItems =
    news?.map(item => <NewsListItem key={item.id} news={item} regionCode={regionCode} languageCode={languageCode} />) ??
    []
  const getLabel = (value: NewsSourceFilter): string => t(desktop ? `${value}News` : value)

  return (
    <RegionContentLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} regionModel={region} />
      <H1>{t('news')}</H1>
      <Stack gap={1}>
        <NewsSourceFilterButtonGroup
          setValue={setNewsSourceFilter}
          options={NEWS_SOURCE_FILTERS}
          value={newsSourceFilter}
          getLabel={getLabel}
        />
        {response.isPending ? <SkeletonList /> : <List items={newsListItems} noItemsMessage='news:currentlyNoNews' />}
      </Stack>
    </RegionContentLayout>
  )
}

export default NewsPage
