import React, { ReactElement, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'

import { parseHTML, pathnameFromRouteInformation, SEARCH_ROUTE, useSearch, SEARCH_QUERY_KEY, useDebounce } from 'shared'
import { config } from 'translations'

import { CityRouteProps } from '../CityContentSwitcher'
import CityContentLayout, { CityContentLayoutProps } from '../components/CityContentLayout'
import FailureSwitcher from '../components/FailureSwitcher'
import Helmet from '../components/Helmet'
import LoadingSpinner from '../components/LoadingSpinner'
import SearchFeedback from '../components/SearchFeedback'
import SearchInput from '../components/SearchInput'
import SearchListItem from '../components/SearchListItem'
import { helpers } from '../constants/theme'
import { cmsApiBaseUrl } from '../constants/urls'
import useLoadSearchDocuments from '../hooks/useLoadSearchDocuments'
import useReportError from '../hooks/useReportError'

const List = styled.ul`
  list-style-type: none;

  & a {
    ${helpers.removeLinkHighlighting}
  }
`

const SearchCounter = styled.p`
  padding: 0 5px;
  color: ${props => props.theme.colors.textSecondaryColor};
`

const SearchPage = ({ city, cityCode, languageCode, pathname }: CityRouteProps): ReactElement | null => {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get(SEARCH_QUERY_KEY) ?? ''
  const [filterText, setFilterText] = useState(query)
  const debouncedQuery = useDebounce(filterText)

  const { t } = useTranslation('search')
  const navigate = useNavigate()
  const fallbackLanguage = config.sourceLanguage

  const {
    data: contentLanguageDocuments,
    loading,
    error,
  } = useLoadSearchDocuments({ cityCode, languageCode, cmsApiBaseUrl })
  const { data: fallbackData } = useLoadSearchDocuments({ cityCode, languageCode: fallbackLanguage, cmsApiBaseUrl })

  const contentLanguageReturn = useSearch(contentLanguageDocuments, debouncedQuery)
  const fallbackLanguageDocuments = languageCode !== fallbackLanguage ? fallbackData : []
  const fallbackLanguageReturn = useSearch(fallbackLanguageDocuments, debouncedQuery)
  const results = contentLanguageReturn.data.concat(fallbackLanguageReturn.data)

  useReportError(contentLanguageReturn.error ?? fallbackLanguageReturn.error)

  useEffect(() => {
    const params = new URLSearchParams()
    if (debouncedQuery) {
      params.set(SEARCH_QUERY_KEY, debouncedQuery)
    }
    setSearchParams(params)
    const append = debouncedQuery ? `?${SEARCH_QUERY_KEY}=${debouncedQuery}` : ''
    navigate(`${pathname}${append}`, { replace: true })
  }, [debouncedQuery, setSearchParams, navigate, pathname])

  if (!city) {
    return null
  }

  const languageChangePaths = city.languages.map(({ code, name }) => ({
    path: `${pathnameFromRouteInformation({ route: SEARCH_ROUTE, cityCode, languageCode: code })}/?${SEARCH_QUERY_KEY}=${debouncedQuery}`,
    name,
    code,
  }))

  const layoutParams: Omit<CityContentLayoutProps, 'isLoading'> = {
    city,
    languageChangePaths,
    route: SEARCH_ROUTE,
    languageCode,
  }

  if (error) {
    return (
      <CityContentLayout isLoading={false} {...layoutParams}>
        <FailureSwitcher error={error} />
      </CityContentLayout>
    )
  }

  const getPageContent = () => {
    if (!debouncedQuery) {
      return null
    }
    if (loading) {
      return <LoadingSpinner />
    }

    return (
      <>
        <List>
          <SearchCounter aria-live={results.length === 0 ? 'assertive' : 'polite'}>
            {t('searchResultsCount', { count: results.length })}
          </SearchCounter>
          {results.map(({ title, content, path, thumbnail }) => (
            <SearchListItem
              title={title}
              contentWithoutHtml={parseHTML(content)}
              key={path}
              query={debouncedQuery}
              path={path}
              thumbnail={thumbnail}
            />
          ))}
        </List>
        <SearchFeedback
          cityCode={cityCode}
          languageCode={languageCode}
          noResults={results.length === 0}
          query={debouncedQuery}
        />
      </>
    )
  }

  return (
    <CityContentLayout isLoading={false} {...layoutParams}>
      <Helmet
        pageTitle={`${t('pageTitle')} - ${city.name}`}
        languageChangePaths={languageChangePaths}
        cityModel={city}
      />
      <SearchInput
        filterText={filterText}
        placeholderText={t('searchPlaceholder')}
        onFilterTextChange={setFilterText}
        spaceSearch
      />
      {getPageContent()}
    </CityContentLayout>
  )
}

export default SearchPage
