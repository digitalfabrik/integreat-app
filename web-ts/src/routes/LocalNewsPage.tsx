import React, { ReactElement, useCallback, useContext } from 'react'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import {
  useLoadFromEndpoint,
  LOCAL_NEWS_TYPE,
  CityModel,
  LanguageModel,
  LocalNewsModel,
  normalizePath,
  createLocalNewsEndpoint, NotFoundError, replaceLinks
} from 'api-client'
import LocationLayout from '../components/LocationLayout'
import LocationToolbar from '../components/LocationToolbar'
import { FeedbackRatingType } from '../components/FeedbackToolbarItem'
import DateFormatterContext from '../context/DateFormatterContext'
import { useTranslation } from 'react-i18next'
import NewsListItem from '../components/NewsListItem'
import { createPath } from './index'
import NewsTabs from '../components/NewsTabs'
import LocalNewsList from '../components/LocalNewsList'
import { cmsApiBaseUrl } from '../constants/urls'
import LoadingSpinner from '../components/LoadingSpinner'
import { FailureSwitcher } from '../components/FailureSwitcher'
import Page from '../components/Page'

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

  const newsModel = newsId && localNews?.find(it => it.id.toString() === newsId)

  const renderLocalNewsListItem = (localNewsItem: LocalNewsModel) => {
    const { id, title, message, timestamp } = localNewsItem
    return (
      <NewsListItem
        title={title}
        content={message}
        timestamp={timestamp}
        key={id}
        link={createPath(LOCAL_NEWS_TYPE, { cityCode, languageCode, newsId: id})}
        t={t}
        formatter={formatter}
        type={LOCAL_NEWS_TYPE}
      />
    )
  }

  const toolbar = (openFeedback: (rating: FeedbackRatingType) => void) => (
    <LocationToolbar openFeedbackModal={openFeedback} viewportSmall={false} />
  )

  const languageChangePaths = languages.map(({ code, name }) => {
    const rootPath = createPath(LOCAL_NEWS_TYPE, { cityCode, languageCode: code })
    return {
      // TODO
      path: rootPath,
      name,
      code
    }
  })

  const locationLayoutParams = {
    cityModel,
    viewportSmall,
    // TODO
    feedbackTargetInformation: null,
    languageChangePaths,
    route: LOCAL_NEWS_TYPE,
    languageCode,
    pathname,
    toolbar
  }

  if (loading) {
    return (
      <LocationLayout isLoading {...locationLayoutParams}>
        <LoadingSpinner />
      </LocationLayout>
    )
  }

  if (!localNews || (newsId && !newsModel)) {
    const error = newsError || new NotFoundError({
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
    const linkedContent = replaceLinks(newsModel.message)
    return (
      <LocationLayout isLoading={false} {...locationLayoutParams}>
        <Page
          title={newsModel.title}
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

  return (
    <LocationLayout isLoading={false} {...locationLayoutParams}>
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
