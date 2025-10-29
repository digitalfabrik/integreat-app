import React, { ReactElement, useCallback } from 'react'

import { NEWS_ROUTE, pathnameFromRouteInformation, TU_NEWS_TYPE, tunewsLabel } from 'shared'
import { createTunewsEndpoint, createTunewsLanguagesEndpoint, TunewsModel, useLoadFromEndpoint } from 'shared/api'

import { CityRouteProps } from '../CityContentSwitcher'
import CityContentLayout, { CityContentLayoutProps } from '../components/CityContentLayout'
import CityContentToolbar from '../components/CityContentToolbar'
import FailureSwitcher from '../components/FailureSwitcher'
import Helmet from '../components/Helmet'
import InfiniteScrollList from '../components/InfiniteScrollList'
import LanguageFailure from '../components/LanguageFailure'
import ListSkeleton from '../components/ListSkeleton'
import NewsListItem from '../components/NewsListItem'
import NewsTabs from '../components/NewsTabs'
import { tunewsApiBaseUrl } from '../constants/urls'

const DEFAULT_PAGE = 1
const DEFAULT_COUNT = 10

const TuNewsPage = ({ cityCode, languageCode, city }: CityRouteProps): ReactElement | null => {
  const { data: tuNewsLanguages, error } = useLoadFromEndpoint(
    createTunewsLanguagesEndpoint,
    tunewsApiBaseUrl,
    undefined,
  )

  const loadTuNews = useCallback(
    async (page: number) => {
      const endpoint = createTunewsEndpoint(tunewsApiBaseUrl)
      const { data } = await endpoint.request({ language: languageCode, page, count: DEFAULT_COUNT })
      if (!data) {
        throw new Error('Data missing!')
      }
      return data
    },
    [languageCode],
  )

  if (!city) {
    return null
  }

  const renderTuNewsListItem = (tuNewsModel: TunewsModel) => {
    const { id, title, content, date } = tuNewsModel
    return (
      <NewsListItem
        title={title}
        content={content}
        timestamp={date}
        key={id}
        to={pathnameFromRouteInformation({
          route: NEWS_ROUTE,
          newsType: TU_NEWS_TYPE,
          cityCode,
          languageCode,
          newsId: id,
        })}
      />
    )
  }

  const languageChangePaths = city.languages.map(({ code, name }) => {
    const isLanguageAvailable = tuNewsLanguages?.find(language => language.code === code)
    return {
      path: isLanguageAvailable
        ? pathnameFromRouteInformation({ route: NEWS_ROUTE, newsType: TU_NEWS_TYPE, cityCode, languageCode: code })
        : null,
      name,
      code,
    }
  })

  const pageTitle = `${tunewsLabel} - ${city.name}`
  const locationLayoutParams: Omit<CityContentLayoutProps, 'isLoading'> = {
    city,
    languageChangePaths,
    languageCode,
    pageTitle,
    Toolbar: <CityContentToolbar />,
  }

  if (error) {
    return (
      <CityContentLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcher error={error} />
      </CityContentLayout>
    )
  }

  if (!tuNewsLanguages) {
    return (
      <CityContentLayout isLoading {...locationLayoutParams}>
        <NewsTabs
          type={TU_NEWS_TYPE}
          city={cityCode}
          tunewsEnabled={city.tunewsEnabled}
          localNewsEnabled={city.localNewsEnabled}
          language={languageCode}
        />
        <ListSkeleton showBreadcrumbSkeleton={false} showHeaderSkeleton={false} showItemIcon={false} />
      </CityContentLayout>
    )
  }

  if (!tuNewsLanguages.find(({ code }) => code === languageCode)) {
    return (
      <CityContentLayout isLoading={false} {...locationLayoutParams}>
        <NewsTabs
          type={TU_NEWS_TYPE}
          city={cityCode}
          tunewsEnabled={city.tunewsEnabled}
          localNewsEnabled={city.localNewsEnabled}
          language={languageCode}
        />
        <LanguageFailure cityModel={city} languageCode={languageCode} languageChangePaths={languageChangePaths} />
      </CityContentLayout>
    )
  }

  return (
    <CityContentLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={city} />
      <NewsTabs
        type={TU_NEWS_TYPE}
        city={cityCode}
        tunewsEnabled={city.tunewsEnabled}
        localNewsEnabled={city.localNewsEnabled}
        language={languageCode}
      />
      <InfiniteScrollList
        loadPage={loadTuNews}
        renderItem={renderTuNewsListItem}
        noItemsMessage='news:currentlyNoNews'
        defaultPage={DEFAULT_PAGE}
        itemsPerPage={DEFAULT_COUNT}
      />
    </CityContentLayout>
  )
}

export default TuNewsPage
