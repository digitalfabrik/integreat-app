import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import {
  LOCAL_NEWS_TYPE,
  NEWS_ROUTE,
  NewsRouteInformationType,
  pathnameFromRouteInformation,
  replaceLinks,
} from 'shared'
import { createLocalNewsEndpoint, LocalNewsModel, NotFoundError, useLoadFromEndpoint } from 'shared/api'

import { RegionRouteProps } from '../RegionContentNavigator'
import FailureSwitcherWithHelmet from '../components/FailureSwitcherWithHelmet'
import Helmet from '../components/Helmet'
import NewsListItem from '../components/NewsListItem'
import NewsTabs from '../components/NewsTabs'
import Page from '../components/Page'
import RegionContentLayout, { RegionContentLayoutProps } from '../components/RegionContentLayout'
import RegionContentToolbar from '../components/RegionContentToolbar'
import SkeletonList from '../components/SkeletonList'
import SkeletonPage from '../components/SkeletonPage'
import List from '../components/base/List'
import { cmsApiBaseUrl } from '../constants/urls'
import useTtsPlayer from '../hooks/useTtsPlayer'

const LocalNewsPage = ({ region, pathname, languageCode, regionCode }: RegionRouteProps): ReactElement | null => {
  const { newsId } = useParams()
  const { t } = useTranslation('news')

  const {
    data: localNews,
    loading,
    error: newsError,
  } = useLoadFromEndpoint(createLocalNewsEndpoint, cmsApiBaseUrl, { region: regionCode, language: languageCode })

  const newsModel = newsId ? localNews?.find((it: LocalNewsModel) => it.id.toString() === newsId) : undefined
  useTtsPlayer(newsModel, languageCode)

  if (!region) {
    return null
  }

  const createNewsPath = ({ languageCode: newLanguageCode, newsId }: Partial<NewsRouteInformationType>): string =>
    pathnameFromRouteInformation({
      route: NEWS_ROUTE,
      newsType: LOCAL_NEWS_TYPE,
      regionCode,
      languageCode: newLanguageCode ?? languageCode,
      newsId,
    })

  const languageChangePaths = region.languages.map(({ code, name }) => {
    const newNewsId = newsModel?.availableLanguages[code]
    return {
      path: newsId && newNewsId === undefined ? null : createNewsPath({ languageCode: code, newsId: newNewsId }),
      name,
      code,
    }
  })

  const pageTitle = `${newsModel && newsModel.title ? newsModel.title : t('localNews.pageTitle')} - ${region.name}`
  const locationLayoutParams: Omit<RegionContentLayoutProps, 'isLoading'> = {
    region,
    languageChangePaths,
    languageCode,
    pageTitle,
    Toolbar: <RegionContentToolbar />,
  }

  if (newsError) {
    const error = new NotFoundError({
      type: LOCAL_NEWS_TYPE,
      id: pathname,
      region: regionCode,
      language: languageCode,
    })

    return (
      <RegionContentLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcherWithHelmet error={error} />
      </RegionContentLayout>
    )
  }

  if (newsId) {
    if (!newsModel) {
      return (
        <RegionContentLayout isLoading={false} {...locationLayoutParams}>
          <SkeletonPage />
        </RegionContentLayout>
      )
    }
    const linkedContent = replaceLinks(newsModel.content)
    return (
      <RegionContentLayout isLoading={false} {...locationLayoutParams}>
        <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} regionModel={region} />
        <Page
          title={newsModel.title}
          content={linkedContent}
          lastUpdate={newsModel.timestamp}
          showLastUpdateText={false}
        />
      </RegionContentLayout>
    )
  }

  const NewsListItems = localNews?.map(localNewsItem => {
    const { id, title, content, timestamp } = localNewsItem
    return (
      <NewsListItem
        title={title}
        content={content}
        timestamp={timestamp}
        key={id}
        to={createNewsPath({ newsId: id })}
      />
    )
  })

  return (
    <RegionContentLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} regionModel={region} />
      <NewsTabs
        type={LOCAL_NEWS_TYPE}
        region={regionCode}
        tunewsEnabled={region.tunewsEnabled}
        localNewsEnabled={region.localNewsEnabled}
        language={languageCode}
      />
      {loading ? <SkeletonList /> : <List items={NewsListItems ?? []} NoItemsMessage='news:currentlyNoNews' />}
    </RegionContentLayout>
  )
}

export default LocalNewsPage
