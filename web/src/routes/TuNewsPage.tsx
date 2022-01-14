import React, { ReactElement, useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  createTunewsEndpoint,
  createTunewsLanguagesEndpoint,
  loadFromEndpoint,
  NEWS_ROUTE,
  pathnameFromRouteInformation,
  TU_NEWS_TYPE,
  TunewsModel,
  useLoadFromEndpoint
} from 'api-client'

import { CityRouteProps } from '../CityContentSwitcher'
import FailureSwitcher from '../components/FailureSwitcher'
import Helmet from '../components/Helmet'
import LanguageFailure from '../components/LanguageFailure'
import LoadingSpinner from '../components/LoadingSpinner'
import LocationLayout from '../components/LocationLayout'
import NewsListItem from '../components/NewsListItem'
import NewsTabs from '../components/NewsTabs'
import TuNewsList from '../components/TuNewsList'
import { tunewsApiBaseUrl } from '../constants/urls'
import DateFormatterContext from '../contexts/DateFormatterContext'
import { TU_NEWS_ROUTE } from './index'

const DEFAULT_PAGE = 1
const DEFAULT_COUNT = 10

const TuNewsPage = ({ cityCode, languageCode, cityModel, languages }: CityRouteProps): ReactElement => {
  const formatter = useContext(DateFormatterContext)
  const { t } = useTranslation('news')
  const viewportSmall = false

  const loadTuNewsLanguages = useCallback(async () => createTunewsLanguagesEndpoint(tunewsApiBaseUrl).request(), [])
  const { data: tuNewsLanguages, error: languagesError } = useLoadFromEndpoint(loadTuNewsLanguages)

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
      const request = () => endpoint.request({ language: languageCode, page, count: DEFAULT_COUNT })
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
  }, [page, languageCode, tuNews, setTuNews, setError, setLoading, hasMore])

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
        link={pathnameFromRouteInformation({
          route: NEWS_ROUTE,
          newsType: TU_NEWS_TYPE,
          cityCode,
          languageCode,
          newsId: id.toString()
        })}
        t={t}
        formatter={formatter}
        type={TU_NEWS_TYPE}
      />
    )
  }

  const locationLayoutParams = {
    cityModel,
    viewportSmall,
    feedbackTargetInformation: null,
    languageChangePaths: null,
    route: TU_NEWS_ROUTE,
    languageCode
  }

  const errorToShow = error || languagesError
  if (errorToShow) {
    return (
      <LocationLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcher error={errorToShow} />
      </LocationLayout>
    )
  }

  if (!tuNewsLanguages || (loading && tuNews.length === 0)) {
    return (
      <LocationLayout isLoading {...locationLayoutParams}>
        <NewsTabs
          type={TU_NEWS_TYPE}
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

  const languageChangePaths = languages.map(({ code, name }) => {
    const isLanguageAvailable = tuNewsLanguages.find(language => language.code === code)
    return {
      path: isLanguageAvailable
        ? pathnameFromRouteInformation({ route: NEWS_ROUTE, newsType: TU_NEWS_TYPE, cityCode, languageCode: code })
        : null,
      name,
      code
    }
  })

  if (!tuNewsLanguages.find(({ code }) => code === languageCode)) {
    return (
      <LocationLayout isLoading={false} {...locationLayoutParams} languageChangePaths={languageChangePaths}>
        <NewsTabs
          type={TU_NEWS_TYPE}
          city={cityCode}
          tunewsEnabled={cityModel.tunewsEnabled}
          localNewsEnabled={cityModel.localNewsEnabled}
          t={t}
          language={languageCode}>
          <LanguageFailure
            cityModel={cityModel}
            languageCode={languageCode}
            languageChangePaths={languageChangePaths}
          />
        </NewsTabs>
      </LocationLayout>
    )
  }

  const pageTitle = `${t('tuNews.pageTitle')} - ${cityModel.name}`

  return (
    <LocationLayout isLoading={false} {...locationLayoutParams} languageChangePaths={languageChangePaths}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={cityModel} />
      <NewsTabs
        type={TU_NEWS_TYPE}
        city={cityCode}
        tunewsEnabled={cityModel.tunewsEnabled}
        localNewsEnabled={cityModel.localNewsEnabled}
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
