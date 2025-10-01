import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import {
  parseHTML,
  pathnameFromRouteInformation,
  SEARCH_ROUTE,
  useSearch,
  SEARCH_QUERY_KEY,
  useDebounce,
  MAX_SEARCH_RESULTS,
  filterRedundantFallbackLanguageResults,
} from 'shared'
import { ExtendedPageModel } from 'shared/api'
import { config } from 'translations'

import { CityRouteProps } from '../CityContentSwitcher'
import CityContentLayout, { CityContentLayoutProps } from '../components/CityContentLayout'
import FailureSwitcher from '../components/FailureSwitcher'
import Helmet from '../components/Helmet'
import LoadingSpinner from '../components/LoadingSpinner'
import SearchFeedback from '../components/SearchFeedback'
import SearchInput from '../components/SearchInput'
import SearchListItem from '../components/SearchListItem'
import List from '../components/base/List'
import { cmsApiBaseUrl } from '../constants/urls'
import useLoadSearchDocuments from '../hooks/useLoadSearchDocuments'
import useReportError from '../hooks/useReportError'

type SearchProps = {
  query: string
  loading: boolean
  results: ExtendedPageModel[]
}

const SearchResults = ({ query, loading, results }: SearchProps): ReactElement | null => {
  const { t } = useTranslation('search')

  if (query.length === 0) {
    return null
  }

  if (loading) {
    return <LoadingSpinner />
  }

  const items = results.map(({ title, content, path }) => (
    <SearchListItem title={title} contentWithoutHtml={parseHTML(content)} key={path} query={query} path={path} />
  ))

  return (
    <>
      <Typography variant='label1' aria-live={results.length === 0 ? 'assertive' : 'polite'}>
        {t('searchResultsCount', { count: results.length })}
      </Typography>
      <List items={items} />
      <SearchFeedback noResults={results.length === 0} query={query} />
    </>
  )
}

const SearchPage = ({ city, cityCode, languageCode }: CityRouteProps): ReactElement | null => {
  const [queryParams, setQueryParams] = useSearchParams()
  const [query, setQuery] = useState(queryParams.get(SEARCH_QUERY_KEY) ?? '')
  const { t } = useTranslation('search')
  const fallbackLanguage = config.sourceLanguage
  const debouncedQuery = useDebounce(query)

  useEffect(() => {
    setQueryParams(debouncedQuery.length > 0 ? { query: debouncedQuery } : undefined, { replace: true })
  }, [debouncedQuery, setQueryParams])

  const {
    data: contentLanguageDocuments,
    loading,
    error,
  } = useLoadSearchDocuments({ cityCode, languageCode, cmsApiBaseUrl })

  const { data: fallbackData } = useLoadSearchDocuments({
    cityCode,
    languageCode: fallbackLanguage,
    cmsApiBaseUrl,
  })

  const contentLanguageReturn = useSearch(contentLanguageDocuments, debouncedQuery)
  const fallbackLanguageDocuments = languageCode !== fallbackLanguage ? fallbackData : []
  const fallbackLanguageReturn = useSearch(fallbackLanguageDocuments, debouncedQuery)
  const fallbackLanguageResults = filterRedundantFallbackLanguageResults({
    fallbackLanguageResults: fallbackLanguageReturn.data,
    contentLanguageResults: contentLanguageReturn.data,
    fallbackLanguage,
  })
  const results = contentLanguageReturn.data.concat(fallbackLanguageResults).slice(0, MAX_SEARCH_RESULTS)

  useReportError(contentLanguageReturn.error ?? fallbackLanguageReturn.error)

  if (!city) {
    return null
  }

  const languageChangePaths = city.languages.map(({ code, name }) => ({
    path: `${pathnameFromRouteInformation({
      route: SEARCH_ROUTE,
      cityCode,
      languageCode: code,
    })}/?${SEARCH_QUERY_KEY}=${query}`,
    name,
    code,
  }))

  const layoutParams: Omit<CityContentLayoutProps, 'isLoading'> = {
    city,
    languageChangePaths,
    languageCode,
  }

  if (error) {
    return (
      <CityContentLayout isLoading={false} {...layoutParams}>
        <FailureSwitcher error={error} />
      </CityContentLayout>
    )
  }

  return (
    <CityContentLayout isLoading={false} {...layoutParams}>
      <Helmet
        pageTitle={`${t('pageTitle')} - ${city.name}`}
        languageChangePaths={languageChangePaths}
        cityModel={city}
      />
      <Stack paddingTop={4} gap={2}>
        <SearchInput
          filterText={query}
          placeholderText={t('searchPlaceholder')}
          onFilterTextChange={setQuery}
          autoFocus
        />
        <SearchResults results={results} query={debouncedQuery} loading={loading} />
      </Stack>
    </CityContentLayout>
  )
}

export default SearchPage
