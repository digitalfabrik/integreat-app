import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { NEWS_ROUTE, pathnameFromRouteInformation } from 'shared'
import { createNewsEndpoint, loadFromEndpoint, NewsModel } from 'shared/api'

import Helmet from '../components/Helmet'
import InfiniteScrollList from '../components/InfiniteScrollList'
import NewsListItem from '../components/NewsListItem'
import RegionContentLayout, { RegionContentLayoutProps } from '../components/RegionContentLayout'
import RegionContentToolbar from '../components/RegionContentToolbar'
import H1 from '../components/base/H1'
import { cmsApiBaseUrl } from '../constants/urls'
import { RegionRouteProps } from './index'

const NewsPage = ({ languageCode, regionCode, region }: RegionRouteProps): ReactElement | null => {
  const { t } = useTranslation('news')

  if (!region) {
    return null
  }

  const loadNews = (page: number) =>
    loadFromEndpoint(createNewsEndpoint, cmsApiBaseUrl, { region: regionCode, language: languageCode, page })

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

  return (
    <RegionContentLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} regionModel={region} />
      <H1>{t('news')}</H1>
      <InfiniteScrollList
        request={loadNews}
        renderItem={(news: NewsModel) => (
          <NewsListItem key={news.id} news={news} regionCode={regionCode} languageCode={languageCode} />
        )}
        noItemsMessage='news:currentlyNoNews'
      />
    </RegionContentLayout>
  )
}

export default NewsPage
