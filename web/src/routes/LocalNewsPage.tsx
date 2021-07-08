import React, { ReactElement, useCallback, useContext } from 'react'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import {
  CityModel,
  createLocalNewsEndpoint,
  LanguageModel,
  LOCAL_NEWS_TYPE,
  LocalNewsModel,
  normalizePath,
  NotFoundError,
  replaceLinks,
  useLoadFromEndpoint,
  parseHTML
} from 'api-client'
import LocationLayout from '../components/LocationLayout'
import DateFormatterContext from '../contexts/DateFormatterContext'
import { useTranslation } from 'react-i18next'
import NewsListItem from '../components/NewsListItem'
import { createPath, LOCAL_NEWS_ROUTE } from './index'
import NewsTabs from '../components/NewsTabs'
import LocalNewsList from '../components/LocalNewsList'
import { cmsApiBaseUrl } from '../constants/urls'
import LoadingSpinner from '../components/LoadingSpinner'
import FailureSwitcher from '../components/FailureSwitcher'
import Page from '../components/Page'
import Helmet from '../components/Helmet'

type PropsType = {
  cities: Array<CityModel>
  cityModel: CityModel
  languages: Array<LanguageModel>
  languageModel: LanguageModel
} & RouteComponentProps<{ cityCode: string; languageCode: string; newsId?: string }>

const LocalNewsPage = ({ match, cityModel, languages, location }: PropsType): ReactElement => {
  const { cityCode, languageCode, newsId } = match.params
  const pathname = normalizePath(location.pathname)
  const history = useHistory()
  const formatter = useContext(DateFormatterContext)
  const { t } = useTranslation('news')
  const viewportSmall = false

  const requestLocalNews = useCallback(async () => {
    return createLocalNewsEndpoint(cmsApiBaseUrl).request({ city: cityCode, language: languageCode })
  }, [cityCode, languageCode])
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
        link={createPath(LOCAL_NEWS_ROUTE, { cityCode, languageCode, newsId: id })}
        t={t}
        formatter={formatter}
        type={LOCAL_NEWS_TYPE}
      />
    )
  }

  // Language change is not possible between local news detail views because we don't know the id of other languages
  const languageChangePaths = languages.map(({ code, name }) => ({
    path: newsId ? null : createPath(LOCAL_NEWS_ROUTE, { cityCode, languageCode: code }),
    name,
    code
  }))

  const locationLayoutParams = {
    cityModel,
    viewportSmall,
    feedbackTargetInformation: null,
    languageChangePaths,
    route: LOCAL_NEWS_ROUTE,
    languageCode,
    pathname
  }

  if (loading) {
    return (
      <LocationLayout isLoading {...locationLayoutParams}>
        <NewsTabs
          type={LOCAL_NEWS_TYPE}
          city={cityCode}
          tunewsEnabled={cityModel.tunewsEnabled}
          localNewsEnabled={cityModel.pushNotificationsEnabled}
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
    const decodedNewsModelTitle = parseHTML(newsModel.title)

    const pageTitle = `${newsModel.title} - ${cityModel.name}`
    const linkedContent = replaceLinks(newsModel.message)
    return (
      <LocationLayout isLoading={false} {...locationLayoutParams}>
        <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={cityModel} />
        <Page
          title={decodedNewsModelTitle}
          content={linkedContent}
          formatter={formatter}
          lastUpdateFormat='LLL'
          lastUpdate={newsModel.timestamp}
          showLastUpdateText={false}
          onInternalLinkClick={history.push}
        />
      </LocationLayout>
    )
  }

  const pageTitle = `${t('app:pageTitles.localNews')} - ${cityModel.name}`

  return (
    <LocationLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={cityModel} />
      <NewsTabs
        type={LOCAL_NEWS_TYPE}
        city={cityCode}
        tunewsEnabled={cityModel.tunewsEnabled}
        localNewsEnabled={cityModel.pushNotificationsEnabled}
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
