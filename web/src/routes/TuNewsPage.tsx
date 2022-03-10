import React, { ReactElement, useCallback, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import {
  createTunewsEndpoint,
  createTunewsLanguagesEndpoint,
  NEWS_ROUTE,
  pathnameFromRouteInformation,
  TU_NEWS_TYPE,
  TunewsModel,
  useLoadFromEndpoint
} from 'api-client'

import { CityRouteProps } from '../CityContentSwitcher'
import FailureSwitcher from '../components/FailureSwitcher'
import Helmet from '../components/Helmet'
import InfiniteScrollList from '../components/InfiniteScrollList'
import LanguageFailure from '../components/LanguageFailure'
import LoadingSpinner from '../components/LoadingSpinner'
import LocationLayout from '../components/LocationLayout'
import NewsListItem from '../components/NewsListItem'
import NewsTabs from '../components/NewsTabs'
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
  const { data: tuNewsLanguages, error } = useLoadFromEndpoint(loadTuNewsLanguages)

  const loadTuNews = useCallback(
    async (page: number) => {
      const endpoint = createTunewsEndpoint(tunewsApiBaseUrl)
      return endpoint.request({ language: languageCode, page, count: DEFAULT_COUNT })
    },
    [languageCode]
  )

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

  if (error) {
    return (
      <LocationLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcher error={error} />
      </LocationLayout>
    )
  }

  if (!tuNewsLanguages) {
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
        <InfiniteScrollList
          loadPage={loadTuNews}
          renderItem={renderTuNewsListItem}
          noItemsMessage={t('currentlyNoNews')}
          defaultPage={DEFAULT_PAGE}
          resetOnLanguageChange
          languageCode={languageCode}
          itemsPerPage={DEFAULT_COUNT}
        />
      </NewsTabs>
    </LocationLayout>
  )
}

export default TuNewsPage
