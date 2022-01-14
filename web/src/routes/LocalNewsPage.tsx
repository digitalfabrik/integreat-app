import React, { ReactElement, useCallback, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import {
  createLocalNewsEndpoint,
  LOCAL_NEWS_TYPE,
  LocalNewsModel,
  NEWS_ROUTE,
  NotFoundError,
  pathnameFromRouteInformation,
  replaceLinks,
  useLoadFromEndpoint
} from 'api-client'

import { CityRouteProps } from '../CityContentSwitcher'
import FailureSwitcher from '../components/FailureSwitcher'
import Helmet from '../components/Helmet'
import LoadingSpinner from '../components/LoadingSpinner'
import LocalNewsList from '../components/LocalNewsList'
import LocationLayout from '../components/LocationLayout'
import NewsListItem from '../components/NewsListItem'
import NewsTabs from '../components/NewsTabs'
import Page from '../components/Page'
import { cmsApiBaseUrl } from '../constants/urls'
import DateFormatterContext from '../contexts/DateFormatterContext'
import { LOCAL_NEWS_ROUTE } from './index'

const LocalNewsPage = ({ cityModel, languages, pathname, languageCode, cityCode }: CityRouteProps): ReactElement => {
  const { newsId } = useParams()
  const formatter = useContext(DateFormatterContext)
  const { t } = useTranslation('news')
  const navigate = useNavigate()
  const viewportSmall = false

  const requestLocalNews = useCallback(
    async () => createLocalNewsEndpoint(cmsApiBaseUrl).request({ city: cityCode, language: languageCode }),
    [cityCode, languageCode]
  )
  const { data: localNews, loading, error: newsError } = useLoadFromEndpoint(requestLocalNews)

  const newsModel = newsId && localNews?.find((it: LocalNewsModel) => it.id.toString() === newsId)

  const renderLocalNewsListItem = (localNewsItem: LocalNewsModel) => {
    const { id, title, message, timestamp } = localNewsItem
    return (
      <NewsListItem
        title={title}
        content={message}
        timestamp={timestamp}
        key={id}
        link={pathnameFromRouteInformation({
          route: NEWS_ROUTE,
          newsType: LOCAL_NEWS_TYPE,
          cityCode,
          languageCode,
          newsId: id.toString()
        })}
        t={t}
        formatter={formatter}
        type={LOCAL_NEWS_TYPE}
      />
    )
  }

  // Language change is not possible between local news detail views because we don't know the id of other languages
  const languageChangePaths = languages.map(({ code, name }) => ({
    path: newsId
      ? null
      : pathnameFromRouteInformation({ route: NEWS_ROUTE, newsType: LOCAL_NEWS_TYPE, cityCode, languageCode: code }),
    name,
    code
  }))

  const locationLayoutParams = {
    cityModel,
    viewportSmall,
    feedbackTargetInformation: null,
    languageChangePaths,
    route: LOCAL_NEWS_ROUTE,
    languageCode
  }

  if (loading) {
    return (
      <LocationLayout isLoading {...locationLayoutParams}>
        <NewsTabs
          type={LOCAL_NEWS_TYPE}
          city={cityCode}
          tunewsEnabled={cityModel.tunewsEnabled}
          localNewsEnabled={cityModel.localNewsEnabled}
          t={t}
          language={languageCode}>
          <LoadingSpinner />
        </NewsTabs>
      </LocationLayout>
    )
  }

  if (!localNews || (newsId && !newsModel)) {
    const error =
      newsError ||
      new NotFoundError({
        type: LOCAL_NEWS_TYPE,
        id: pathname,
        city: cityCode,
        language: languageCode
      })

    return (
      <LocationLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcher error={error} />
      </LocationLayout>
    )
  }

  if (newsModel) {
    const pageTitle = `${newsModel.title} - ${cityModel.name}`
    const linkedContent = replaceLinks(newsModel.message)
    return (
      <LocationLayout isLoading={false} {...locationLayoutParams}>
        <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={cityModel} />
        <Page
          title={newsModel.title}
          content={linkedContent}
          formatter={formatter}
          lastUpdateFormat='LLL'
          lastUpdate={newsModel.timestamp}
          showLastUpdateText={false}
          onInternalLinkClick={navigate}
        />
      </LocationLayout>
    )
  }

  const pageTitle = `${t('localNews.pageTitle')} - ${cityModel.name}`

  return (
    <LocationLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={cityModel} />
      <NewsTabs
        type={LOCAL_NEWS_TYPE}
        city={cityCode}
        tunewsEnabled={cityModel.tunewsEnabled}
        localNewsEnabled={cityModel.localNewsEnabled}
        t={t}
        language={languageCode}>
        <LocalNewsList
          items={localNews}
          noItemsMessage={t('currentlyNoNews')}
          renderItem={renderLocalNewsListItem}
          city={cityCode}
        />
      </NewsTabs>
    </LocationLayout>
  )
}

export default LocalNewsPage
