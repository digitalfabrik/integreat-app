import React, { ReactElement, useCallback, useContext, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import {
  CityModel,
  createTunewsEndpoint,
  LanguageModel,
  normalizePath,
  TU_NEWS_TYPE,
  TunewsModel,
  loadFromEndpoint
} from 'api-client'
import LocationLayout from '../components/LocationLayout'
import DateFormatterContext from '../contexts/DateFormatterContext'
import { useTranslation } from 'react-i18next'
import NewsListItem from '../components/NewsListItem'
import { createPath, TU_NEWS_DETAIL_ROUTE, TU_NEWS_ROUTE } from './index'
import NewsTabs from '../components/NewsTabs'
import { tunewsApiBaseUrl } from '../constants/urls'
import LoadingSpinner from '../components/LoadingSpinner'
import { FailureSwitcher } from '../components/FailureSwitcher'
import TuNewsList from '../components/TuNewsList'
import Helmet from '../components/Helmet'

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
          setTuNews(tuNews.concat(data))

          if (data.length !== DEFAULT_COUNT) {
            setHasMore(false)
          }
        }
      }
      await loadFromEndpoint(request, addTuNews, setError, setLoading)
    }
  }, [page, cityCode, languageCode, tuNews, setTuNews, setError, setLoading, hasMore])

  useEffect(() => {
    // Reset on language change
    setTuNews([])
    setError(null)
    setLoading(false)
    setHasMore(true)
    setPage(DEFAULT_PAGE)
  }, [languageCode, setTuNews, setError, setLoading, setHasMore, setPage])

  const renderTuNewsListItem = (tuNewsModel: TunewsModel) => {
    const { id, title, content, date } = tuNewsModel
    return (
      <NewsListItem
        title={title}
        content={content}
        timestamp={date}
        key={id}
        link={createPath(TU_NEWS_DETAIL_ROUTE, { cityCode, languageCode, newsId: id })}
        t={t}
        formatter={formatter}
        type={TU_NEWS_TYPE}
      />
    )
  }

  const languageChangePaths = languages.map(({ code, name }) => ({
    path: createPath(TU_NEWS_ROUTE, { cityCode, languageCode: code }),
    name,
    code
  }))

  const locationLayoutParams = {
    cityModel,
    viewportSmall,
    feedbackTargetInformation: null,
    languageChangePaths,
    route: TU_NEWS_ROUTE,
    languageCode,
    pathname
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

  const pageTitle = `${t('app:pageTitles.tunews')} - ${cityModel.name}`

  return (
    <LocationLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={cityModel} />
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
