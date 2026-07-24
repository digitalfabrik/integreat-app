import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { NEWS_ROUTE, pathnameFromRouteInformation } from 'shared'
import { createNewsEndpoint } from 'shared/api'

import Helmet from '../components/Helmet'
import NewsListItem from '../components/NewsListItem'
import RegionContentLayout, { RegionContentLayoutProps } from '../components/RegionContentLayout'
import SkeletonList from '../components/SkeletonList'
import H1 from '../components/base/H1'
import List from '../components/base/List'
import { cmsApiBaseUrl } from '../constants/urls'
import useQueryFromEndpoint from '../hooks/useQueryFromEndpoint'
import { RegionRouteProps } from './index'

const NewsPage = ({ languageCode, regionCode, region }: RegionRouteProps): ReactElement | null => {
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
      {response.isPending ? <SkeletonList /> : <List items={newsListItems} noItemsMessage='news:currentlyNoNews' />}
    </RegionContentLayout>
  )
}

export default NewsPage
