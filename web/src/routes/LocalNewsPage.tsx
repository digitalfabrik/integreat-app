import React, { ReactElement, useContext } from 'react'
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
  useLoadFromEndpoint,
} from 'api-client'

import { CityRouteProps } from '../CityContentSwitcher'
import CityContentLayout from '../components/CityContentLayout'
import CityContentToolbar from '../components/CityContentToolbar'
import FailureSwitcher from '../components/FailureSwitcher'
import { FeedbackRatingType } from '../components/FeedbackToolbarItem'
import Helmet from '../components/Helmet'
import LoadingSpinner from '../components/LoadingSpinner'
import LocalNewsList from '../components/LocalNewsList'
import NewsListItem from '../components/NewsListItem'
import NewsTabs from '../components/NewsTabs'
import Page from '../components/Page'
import { cmsApiBaseUrl } from '../constants/urls'
import DateFormatterContext from '../contexts/DateFormatterContext'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { LOCAL_NEWS_ROUTE } from './index'

const LocalNewsPage = ({ cityModel, languages, pathname, languageCode, cityCode }: CityRouteProps): ReactElement => {
  const { newsId } = useParams()
  const formatter = useContext(DateFormatterContext)
  const { t } = useTranslation('news')
  const navigate = useNavigate()
  const { viewportSmall } = useWindowDimensions()

  const {
    data: localNews,
    loading,
    error: newsError,
  } = useLoadFromEndpoint(createLocalNewsEndpoint, cmsApiBaseUrl, { city: cityCode, language: languageCode })

  const newsModel = newsId && localNews?.find((it: LocalNewsModel) => it.id.toString() === newsId)

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
    code,
  }))

  const toolbar = (openFeedback: (rating: FeedbackRatingType) => void) => (
    <CityContentToolbar
      openFeedbackModal={openFeedback}
      hasFeedbackOption={false}
      hasDivider={localNews?.length === 0 && viewportSmall}
    />
  )

  const locationLayoutParams = {
    cityModel,
    viewportSmall,
    feedbackTargetInformation: null,
    languageChangePaths,
    route: LOCAL_NEWS_ROUTE,
    languageCode,
    toolbar,
  }

  if (loading) {
    return (
      <CityContentLayout isLoading {...locationLayoutParams}>
        <NewsTabs
          type={LOCAL_NEWS_TYPE}
          city={cityCode}
          tunewsEnabled={cityModel.tunewsEnabled}
          localNewsEnabled={cityModel.localNewsEnabled}
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
    const pageTitle = `${newsModel.title} - ${cityModel.name}`
    const linkedContent = replaceLinks(newsModel.content)
    return (
      <CityContentLayout isLoading={false} {...locationLayoutParams}>
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
      </CityContentLayout>
    )
  }

  const pageTitle = `${t('localNews.pageTitle')} - ${cityModel.name}`

  return (
    <CityContentLayout isLoading={false} {...locationLayoutParams}>
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
    </CityContentLayout>
  )
}

export default LocalNewsPage
