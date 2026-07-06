import React, { ReactElement, useCallback } from 'react'

import { NEWS_ROUTE, pathnameFromRouteInformation, TU_NEWS_TYPE, tuNewsLabel } from 'shared'
import { createTuNewsEndpoint, createTuNewsLanguagesEndpoint, TuNewsModel } from 'shared/api'

import FailureSwitcherWithHelmet from '../components/FailureSwitcherWithHelmet'
import Helmet from '../components/Helmet'
import InfiniteScrollList from '../components/InfiniteScrollList'
import LanguageFailure from '../components/LanguageFailure'
import NewsListItem from '../components/NewsListItem'
import NewsTabs from '../components/NewsTabs'
import RegionContentLayout, { RegionContentLayoutProps } from '../components/RegionContentLayout'
import RegionContentToolbar from '../components/RegionContentToolbar'
import SkeletonList from '../components/SkeletonList'
import { tuNewsApiBaseUrl } from '../constants/urls'
import useQueryFromEndpoint from '../hooks/useQueryFromEndpoint'
import { RegionRouteProps } from './index'

const DEFAULT_PAGE = 1
const DEFAULT_COUNT = 10

const TuNewsPage = ({ regionCode, languageCode, region }: RegionRouteProps): ReactElement | null => {
  const { data: tuNewsLanguages, error } = useQueryFromEndpoint(
    createTuNewsLanguagesEndpoint,
    tuNewsApiBaseUrl,
    undefined,
  )

  const loadTuNews = useCallback(
    async (page: number) => {
      const endpoint = createTuNewsEndpoint(tuNewsApiBaseUrl)
      const { data } = await endpoint.request({ language: languageCode, page, count: DEFAULT_COUNT })
      if (!data) {
        throw new Error('Data missing!')
      }
      return data
    },
    [languageCode],
  )

  if (!region) {
    return null
  }

  const renderTuNewsListItem = (tuNewsModel: TuNewsModel) => {
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
          regionCode,
          languageCode,
          newsId: id,
        })}
      />
    )
  }

  const languageChangePaths = region.languages.map(({ code, name }) => {
    const isLanguageAvailable = tuNewsLanguages?.find(language => language.code === code)
    return {
      path: isLanguageAvailable
        ? pathnameFromRouteInformation({ route: NEWS_ROUTE, newsType: TU_NEWS_TYPE, regionCode, languageCode: code })
        : null,
      name,
      code,
    }
  })

  const pageTitle = `${tuNewsLabel} - ${region.name}`
  const locationLayoutParams: Omit<RegionContentLayoutProps, 'isLoading'> = {
    region,
    languageChangePaths,
    languageCode,
    pageTitle,
    slug: null,
    toolbar: <RegionContentToolbar />,
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
          region={regionCode}
          tuNewsEnabled={region.tuNewsEnabled}
          localNewsEnabled={region.localNewsEnabled}
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
          region={regionCode}
          tuNewsEnabled={region.tuNewsEnabled}
          localNewsEnabled={region.localNewsEnabled}
          language={languageCode}
        />
        <LanguageFailure regionModel={region} languageCode={languageCode} languageChangePaths={languageChangePaths} />
      </RegionContentLayout>
    )
  }

  return (
    <RegionContentLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} regionModel={region} />
      <NewsTabs
        type={TU_NEWS_TYPE}
        region={regionCode}
        tuNewsEnabled={region.tuNewsEnabled}
        localNewsEnabled={region.localNewsEnabled}
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
