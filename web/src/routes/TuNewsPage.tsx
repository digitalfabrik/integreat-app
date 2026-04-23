import React, { ReactElement, useCallback } from 'react'

import { NEWS_ROUTE, pathnameFromRouteInformation, TU_NEWS_TYPE, tunewsLabel } from 'shared'
import { createTunewsEndpoint, createTunewsLanguagesEndpoint, TunewsModel, useLoadFromEndpoint } from 'shared/api'

import { CityRouteProps } from '../RegionContentNavigator'
import FailureSwitcherWithHelmet from '../components/FailureSwitcherWithHelmet'
import Helmet from '../components/Helmet'
import InfiniteScrollList from '../components/InfiniteScrollList'
import LanguageFailure from '../components/LanguageFailure'
import NewsListItem from '../components/NewsListItem'
import NewsTabs from '../components/NewsTabs'
import RegionContentLayout, { CityContentLayoutProps } from '../components/RegionContentLayout'
import RegionContentToolbar from '../components/RegionContentToolbar'
import SkeletonList from '../components/SkeletonList'
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
    const { id, title, content, lastUpdate } = tuNewsModel
    return (
      <NewsListItem
        title={title}
        content={content}
        timestamp={lastUpdate}
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
    Toolbar: <RegionContentToolbar />,
  }

  if (error) {
    return (
      <RegionContentLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcherWithHelmet error={error} />
      </RegionContentLayout>
    )
  }

  if (!tuNewsLanguages) {
    return (
      <RegionContentLayout isLoading {...locationLayoutParams}>
        <NewsTabs
          type={TU_NEWS_TYPE}
          city={cityCode}
          tunewsEnabled={city.tunewsEnabled}
          localNewsEnabled={city.localNewsEnabled}
          language={languageCode}
        />
        <SkeletonList />
      </RegionContentLayout>
    )
  }

  if (!tuNewsLanguages.find(({ code }) => code === languageCode)) {
    return (
      <RegionContentLayout isLoading={false} {...locationLayoutParams}>
        <NewsTabs
          type={TU_NEWS_TYPE}
          city={cityCode}
          tunewsEnabled={city.tunewsEnabled}
          localNewsEnabled={city.localNewsEnabled}
          language={languageCode}
        />
        <LanguageFailure cityModel={city} languageCode={languageCode} languageChangePaths={languageChangePaths} />
      </RegionContentLayout>
    )
  }

  return (
    <RegionContentLayout isLoading={false} {...locationLayoutParams}>
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
    </RegionContentLayout>
  )
}

export default TuNewsPage
