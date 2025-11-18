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

import { CityRouteProps } from '../CityContentSwitcher'
import CityContentLayout, { CityContentLayoutProps } from '../components/CityContentLayout'
import CityContentToolbar from '../components/CityContentToolbar'
import FailureSwitcher from '../components/FailureSwitcher'
import Helmet from '../components/Helmet'
import NewsListItem from '../components/NewsListItem'
import NewsTabs from '../components/NewsTabs'
import Page from '../components/Page'
import SkeletonList from '../components/SkeletonList'
import SkeletonPage from '../components/SkeletonPage'
import List from '../components/base/List'
import { cmsApiBaseUrl } from '../constants/urls'
import useTtsPlayer from '../hooks/useTtsPlayer'

const LocalNewsPage = ({ city, pathname, languageCode, cityCode }: CityRouteProps): ReactElement | null => {
  const { newsId } = useParams()
  const { t } = useTranslation('news')

  const {
    data: localNews,
    loading,
    error: newsError,
  } = useLoadFromEndpoint(createLocalNewsEndpoint, cmsApiBaseUrl, { city: cityCode, language: languageCode })

  const newsModel = newsId ? localNews?.find((it: LocalNewsModel) => it.id.toString() === newsId) : undefined
  useTtsPlayer(newsModel, languageCode)

  if (!city) {
    return null
  }

  const createNewsPath = ({ languageCode: newLanguageCode, newsId }: Partial<NewsRouteInformationType>): string =>
    pathnameFromRouteInformation({
      route: NEWS_ROUTE,
      newsType: LOCAL_NEWS_TYPE,
      cityCode,
      languageCode: newLanguageCode ?? languageCode,
      newsId,
    })

  const languageChangePaths = city.languages.map(({ code, name }) => {
    const newNewsId = newsModel?.availableLanguages[code]
    return {
      path: newsId && newNewsId === undefined ? null : createNewsPath({ languageCode: code, newsId: newNewsId }),
      name,
      code,
    }
  })

  const pageTitle = `${newsModel && newsModel.title ? newsModel.title : t('localNews.pageTitle')} - ${city.name}`
  const locationLayoutParams: Omit<CityContentLayoutProps, 'isLoading'> = {
    city,
    languageChangePaths,
    languageCode,
    pageTitle,
    Toolbar: <CityContentToolbar />,
  }

  if (loading) {
    return (
      <CityContentLayout isLoading {...locationLayoutParams}>
        {newsId ? (
          <SkeletonPage />
        ) : (
          <>
            <NewsTabs
              type={LOCAL_NEWS_TYPE}
              city={cityCode}
              tunewsEnabled={city.tunewsEnabled}
              localNewsEnabled={city.localNewsEnabled}
              language={languageCode}
            />
            <SkeletonList />
          </>
        )}
      </CityContentLayout>
    )
  }

  if (newsError) {
    const error = new NotFoundError({
      type: LOCAL_NEWS_TYPE,
      id: pathname,
      city: cityCode,
      language: languageCode,
    })

    return (
      <CityContentLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcher error={error} />
      </CityContentLayout>
    )
  }

  if (newsModel) {
    const linkedContent = replaceLinks(newsModel.content)
    return (
      <CityContentLayout isLoading={false} {...locationLayoutParams}>
        <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={city} />
        <Page
          title={newsModel.title}
          content={linkedContent}
          lastUpdate={newsModel.timestamp}
          showLastUpdateText={false}
        />
      </CityContentLayout>
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
    <CityContentLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={city} />
      <NewsTabs
        type={LOCAL_NEWS_TYPE}
        city={cityCode}
        tunewsEnabled={city.tunewsEnabled}
        localNewsEnabled={city.localNewsEnabled}
        language={languageCode}
      />
      <List items={NewsListItems ?? []} NoItemsMessage='news:currentlyNoNews' />
    </CityContentLayout>
  )
}

export default LocalNewsPage
