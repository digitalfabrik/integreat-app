import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { LOCAL_NEWS_TYPE, NEWS_ROUTE, pathnameFromRouteInformation, replaceLinks } from 'shared'
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
import { LOCAL_NEWS_ROUTE } from './index'

const LocalNewsPage = ({ city, pathname, languageCode, cityCode }: CityRouteProps): ReactElement | null => {
  const { newsId } = useParams()
  const { t } = useTranslation('news')
  const navigate = useNavigate()

  const {
    data: localNews,
    loading,
    error: newsError,
  } = useLoadFromEndpoint(createLocalNewsEndpoint, cmsApiBaseUrl, { city: cityCode, language: languageCode })

  if (!city) {
    return null
  }

  const newsModel = newsId ? localNews?.find((it: LocalNewsModel) => it.id.toString() === newsId) : undefined

  const renderLocalNewsListItem = (localNewsItem: LocalNewsModel) => {
    const { id, title, content, timestamp } = localNewsItem
    return (
      <NewsListItem
        title={title}
        content={content}
        timestamp={timestamp}
        key={id}
        link={pathnameFromRouteInformation({
          route: NEWS_ROUTE,
          newsType: LOCAL_NEWS_TYPE,
          cityCode,
          languageCode,
          newsId: id.toString(),
        })}
        t={t}
        type={LOCAL_NEWS_TYPE}
      />
    )
  }

  // Language change is not possible between local news detail views because we don't know the id of other languages
  const languageChangePaths = city.languages.map(({ code, name }) => ({
    path: newsId
      ? null
      : pathnameFromRouteInformation({ route: NEWS_ROUTE, newsType: LOCAL_NEWS_TYPE, cityCode, languageCode: code }),
    name,
    code,
  }))

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

  if (loading) {
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
          onInternalLinkClick={navigate}
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
