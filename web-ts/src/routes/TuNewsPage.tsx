import React, { ReactElement, useCallback, useContext, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import {
  CityModel,
  LanguageModel,
  normalizePath,
  createTunewsEndpoint,
  TU_NEWS_TYPE,
  TunewsModel
} from 'api-client'
import LocationLayout from '../components/LocationLayout'
import LocationToolbar from '../components/LocationToolbar'
import { FeedbackRatingType } from '../components/FeedbackToolbarItem'
import DateFormatterContext from '../context/DateFormatterContext'
import { useTranslation } from 'react-i18next'
import NewsListItem from '../components/NewsListItem'
import { createPath, TU_NEWS_DETAIL_ROUTE, TU_NEWS_ROUTE } from './index'
import NewsTabs from '../components/NewsTabs'
import { tunewsApiBaseUrl } from '../constants/urls'
import LoadingSpinner from '../components/LoadingSpinner'
import { FailureSwitcher } from '../components/FailureSwitcher'
import TuNewsList from '../components/TuNewsList'
import { loadFromEndpoint } from '../../../api-client/src/endpoints/hooks/useLoadFromEndpoint'

const DEFAULT_PAGE = 1
const DEFAULT_COUNT = 10

type PropsType = {
  cities: Array<CityModel>
  cityModel: CityModel
  languages: Array<LanguageModel>
  languageModel: LanguageModel
} & RouteComponentProps<{ cityCode: string; languageCode: string }>

const TuNewsPage = ({ match, cityModel, languages, location }: PropsType): ReactElement => {
  const { cityCode, languageCode } = match.params
  const pathname = normalizePath(location.pathname)
  const formatter = useContext(DateFormatterContext)
  const { t } = useTranslation('news')
  const viewportSmall = false

  const [tuNews, setTuNews] = useState<TunewsModel[]>([])
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(DEFAULT_PAGE)
  const [hasMore, setHasMore] = useState<boolean>(true)

  const loadTuNews = useCallback(async () => {
    if (hasMore) {
      setLoading(true)
      setPage(page + 1)
      const endpoint = createTunewsEndpoint(tunewsApiBaseUrl)
      const request = () => endpoint.request({ city: cityCode, language: languageCode, page, count: DEFAULT_COUNT })
      const addTuNews = (data: TunewsModel[] | null) => {
        if (data !== null) {
          if (data.length === 0) {
            setHasMore(false)
          } else {
            setTuNews(tuNews.concat(data))
          }
        }
      }
      await loadFromEndpoint(request, addTuNews, setError, setLoading)
    }
  }, [page, cityCode, languageCode, tuNews, setTuNews, setError, setLoading, hasMore])

  const renderTuNewsListItem = (tuNewsModel: TunewsModel) => {
    const { id, title, content, date } = tuNewsModel
    return (
      <NewsListItem
        title={title}
        content={content}
        timestamp={date}
        key={id}
        link={createPath(TU_NEWS_DETAIL_ROUTE, { cityCode, languageCode, newsId: id})}
        t={t}
        formatter={formatter}
        type={TU_NEWS_TYPE}
      />
    )
  }

  const toolbar = (openFeedback: (rating: FeedbackRatingType) => void) => (
    <LocationToolbar openFeedbackModal={openFeedback} viewportSmall={viewportSmall} />
  )

  const languageChangePaths = languages.map(({ code, name }) => {
    const rootPath = createPath(TU_NEWS_ROUTE, { cityCode, languageCode: code })
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
    route: TU_NEWS_ROUTE,
    languageCode,
    pathname,
    toolbar
  }

  if (loading && tuNews.length === 0) {
    return (
      <LocationLayout isLoading {...locationLayoutParams}>
        <NewsTabs
          type={TU_NEWS_TYPE}
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

  if (error) {
    return (
      <LocationLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcher error={error} />
      </LocationLayout>
    )
  }

  return (
    <LocationLayout isLoading={false} {...locationLayoutParams}>
      <NewsTabs
        type={TU_NEWS_TYPE}
        city={cityCode}
        tunewsEnabled={cityModel.tunewsEnabled}
        localNewsEnabled={cityModel.pushNotificationsEnabled}
        t={t}
        language={languageCode}>
        <TuNewsList
          items={tuNews}
          renderItem={renderTuNewsListItem}
          city={cityCode}
          fetchMoreTunews={loadTuNews}
          hasMore={hasMore}
          isFetching={loading}
          language={languageCode}
          noItemsMessage={t('currentlyNoNews')}
        />
      </NewsTabs>
    </LocationLayout>
  )
}

export default TuNewsPage
