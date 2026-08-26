import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import {
  NEWS_ALL_SOURCES_FILTER,
  NEWS_SOURCE_FILTERS,
  NEWS_ROUTE,
  NewsSourceFilter,
  pathnameFromRouteInformation,
  newsFilterToSources,
  NEWS_SOURCE_FILTER_QUERY_KEY,
} from 'shared'
import { createNewsEndpoint } from 'shared/api'

import FailureSwitcherWithHelmet from '../components/FailureSwitcherWithHelmet'
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
import useQueryParam from '../hooks/useQueryParam'
import { RegionRouteProps } from './index'

const NewsSourceFilterButtonGroup = styled(ToggleTextButtonGroup)({
  paddingInline: 16,
}) as typeof ToggleTextButtonGroup

const NewsPage = ({ languageCode, regionCode, region }: RegionRouteProps): ReactElement | null => {
  const [sourceFilter, setSourceFilter] = useQueryParam(NEWS_SOURCE_FILTER_QUERY_KEY, { replace: true })
  const { desktop } = useDimensions()
  const { t } = useTranslation()

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

  const pageTitle = `${t($ => $.news.news)} - ${region.name}`
  const locationLayoutParams: Omit<RegionContentLayoutProps, 'isLoading'> = {
    region,
    languageChangePaths,
    languageCode,
    pageTitle,
    slug: null,
  }

  if (response.error) {
    return (
      <RegionContentLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcherWithHelmet error={response.error} />
      </RegionContentLayout>
    )
  }

  const newsSources = newsFilterToSources(sourceFilter)
  const news = data?.filter(news => !newsSources || newsSources.includes(news.source))
  const newsListItems =
    news?.map(item => <NewsListItem key={item.id} news={item} regionCode={regionCode} languageCode={languageCode} />) ??
    []
  const getLabel = (value: NewsSourceFilter): string => t($ => (desktop ? $.news[`${value}News`] : $.news[value]))
  const showNewsSourceFilter = region.localNewsEnabled && region.externalNewsEnabled

  return (
    <RegionContentLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} regionModel={region} />
      <H1>{t($ => $.news.news)}</H1>
      <Stack sx={{ gap: 1 }}>
        {showNewsSourceFilter && (
          <NewsSourceFilterButtonGroup
            setValue={setSourceFilter}
            options={NEWS_SOURCE_FILTERS}
            value={sourceFilter ?? NEWS_ALL_SOURCES_FILTER}
            getLabel={getLabel}
          />
        )}
        {response.isPending ? (
          <SkeletonList />
        ) : (
          <List items={newsListItems} noItemsMessage={t($ => $.news.currentlyNoNews)} />
        )}
      </Stack>
    </RegionContentLayout>
  )
}

export default NewsPage
