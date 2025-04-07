import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { parseHTML, pathnameFromRouteInformation, SEARCH_ROUTE, useSearch, SEARCH_QUERY_KEY } from 'shared'
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
  const query = new URLSearchParams(useLocation().search).get(SEARCH_QUERY_KEY) ?? ''
  const [filterText, setFilterText] = useState<string>(query)
  const { t } = useTranslation('search')
  const navigate = useNavigate()
  const fallbackLanguage = config.sourceLanguage

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

  const contentLanguageResults = useSearch(contentLanguageDocuments, query)
  const fallbackLanguageDocuments = languageCode !== fallbackLanguage ? fallbackData : []
  const fallbackLanguageResults = useSearch(fallbackLanguageDocuments, query)
  const results = contentLanguageResults.concat(fallbackLanguageResults)

  if (!city) {
    return null
  }

  const languageChangePaths = city.languages.map(({ code, name }) => ({
    path: `${pathnameFromRouteInformation({ route: SEARCH_ROUTE, cityCode, languageCode: code })}/?${SEARCH_QUERY_KEY}=${query}`,
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

  const handleFilterTextChanged = (filterText: string): void => {
    setFilterText(filterText)
    const appendToUrl = filterText.length !== 0 ? `?${SEARCH_QUERY_KEY}=${filterText}` : ''
    navigate(`${pathname}/${appendToUrl}`, { replace: true })
  }

  const getPageContent = () => {
    if (query.length === 0) {
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
              query={query}
              path={path}
              thumbnail={thumbnail}
            />
          ))}
        </List>
        <SearchFeedback
          cityCode={cityCode}
          languageCode={languageCode}
          noResults={results.length === 0}
          query={filterText}
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
        onFilterTextChange={handleFilterTextChanged}
        spaceSearch
      />
      {getPageContent()}
    </CityContentLayout>
  )
}

export default SearchPage
