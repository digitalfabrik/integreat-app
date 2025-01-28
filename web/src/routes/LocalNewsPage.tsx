import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

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
import LoadingSpinner from '../components/LoadingSpinner'
import LocalNewsList from '../components/LocalNewsList'
import NewsListItem from '../components/NewsListItem'
import NewsTabs from '../components/NewsTabs'
import Page from '../components/Page'
import { cmsApiBaseUrl } from '../constants/urls'
import usePreviousProp from '../hooks/usePreviousProp'
import { LOCAL_NEWS_ROUTE } from './index'

const LocalNewsPage = ({ city, pathname, languageCode, cityCode }: CityRouteProps): ReactElement | null => {
  const previousPathname = usePreviousProp({ prop: pathname })
  const { newsId } = useParams()
  const { t } = useTranslation('news')

  const {
    data: localNews,
    loading,
    error: newsError,
  } = useLoadFromEndpoint(createLocalNewsEndpoint, cmsApiBaseUrl, { city: cityCode, language: languageCode })

  if (!city) {
    return null
  }

  const newsModel = newsId ? localNews?.find((it: LocalNewsModel) => it.id.toString() === newsId) : undefined

  const createNewsPath = ({ languageCode: newLanguageCode, newsId }: Partial<NewsRouteInformationType>): string =>
    pathnameFromRouteInformation({
      route: NEWS_ROUTE,
      newsType: LOCAL_NEWS_TYPE,
      cityCode,
      languageCode: newLanguageCode ?? languageCode,
      newsId,
    })
  const renderLocalNewsListItem = (localNewsItem: LocalNewsModel) => {
    const { id, title, content, timestamp } = localNewsItem
    return (
      <NewsListItem
        title={title}
        content={content}
        timestamp={timestamp}
        key={id}
        link={createNewsPath({ newsId: id })}
        t={t}
        type={LOCAL_NEWS_TYPE}
      />
    )
  }

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
    route: LOCAL_NEWS_ROUTE,
    languageCode,
    Toolbar: (
      <CityContentToolbar
        route={LOCAL_NEWS_ROUTE}
        hasFeedbackOption={false}
        hideDivider={localNews?.length !== 0 && !newsId}
        pageTitle={pageTitle}
      />
    ),
  }

  if (loading || previousPathname !== pathname) {
    return (
      <CityContentLayout isLoading {...locationLayoutParams}>
        <NewsTabs
          type={LOCAL_NEWS_TYPE}
          city={cityCode}
          tunewsEnabled={city.tunewsEnabled}
          localNewsEnabled={city.localNewsEnabled}
          t={t}
          language={languageCode}>
          <LoadingSpinner />
        </NewsTabs>
      </CityContentLayout>
    )
  }

  if (!localNews || (newsId && !newsModel)) {
    const error =
      newsError ||
      new NotFoundError({
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

  return (
    <CityContentLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={city} />
      <NewsTabs
        type={LOCAL_NEWS_TYPE}
        city={cityCode}
        tunewsEnabled={city.tunewsEnabled}
        localNewsEnabled={city.localNewsEnabled}
        t={t}
        language={languageCode}>
        <LocalNewsList
          items={localNews}
          noItemsMessage={t('currentlyNoNews')}
          renderItem={renderLocalNewsListItem}
          city={cityCode}
        />
      </NewsTabs>
    </CityContentLayout>
  )
}

export default LocalNewsPage
