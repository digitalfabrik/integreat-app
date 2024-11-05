import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { parseHTML, pathnameFromRouteInformation, SEARCH_ROUTE, useSearch } from 'shared'

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
import useAllPossibleSearchResults from '../hooks/useAllPossibleSearchResults'

const List = styled.ul`
  list-style-type: none;

  & a {
    ${helpers.removeLinkHighlighting}
  }
`

const SearchCounter = styled.text`
  margin: 10px 5px;
  fontsize: 'small';
`

const SearchPage = ({ city, cityCode, languageCode, pathname }: CityRouteProps): ReactElement | null => {
  const query = new URLSearchParams(useLocation().search).get('query') ?? ''
  const [filterText, setFilterText] = useState<string>(query)
  const { t } = useTranslation('search')
  const navigate = useNavigate()

  const {
    data: allPossibleResults,
    loading,
    error,
  } = useAllPossibleSearchResults({
    city: cityCode,
    language: languageCode,
    cmsApiBaseUrl,
  })

  const results = useSearch(allPossibleResults, query)

  if (!city) {
    return null
  }

  const languageChangePaths = city.languages.map(({ code, name }) => ({
    path: pathnameFromRouteInformation({ route: SEARCH_ROUTE, cityCode, languageCode: code }),
    name,
    code,
  }))

  const locationLayoutParams: Omit<CityContentLayoutProps, 'isLoading'> = {
    city,
    languageChangePaths,
    route: SEARCH_ROUTE,
    languageCode,
  }

  const handleFilterTextChanged = (filterText: string): void => {
    setFilterText(filterText)
    const appendToUrl = filterText.length !== 0 ? `?query=${filterText}` : ''
    navigate(`${pathname}/${appendToUrl}`, { replace: true })
  }

  const pageTitle = `${t('pageTitle')} - ${city.name}`

  const SearchBar = (
    <SearchInput
      filterText={filterText}
      placeholderText={t('searchPlaceholder')}
      onFilterTextChange={handleFilterTextChanged}
      spaceSearch
    />
  )

  if (loading || !results) {
    return (
      <CityContentLayout isLoading {...locationLayoutParams}>
        <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={city} />
        {SearchBar}
        <LoadingSpinner />
      </CityContentLayout>
    )
  }

  if (error) {
    return (
      <CityContentLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcher error={error} />
      </CityContentLayout>
    )
  }

  return (
    <CityContentLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={city} />
      {SearchBar}
      {query.length > 0 && (
        <>
          <List>
            <SearchCounter>{t('searchResultsCount', { count: results.length })}</SearchCounter>
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
      )}
    </CityContentLayout>
  )
}

export default SearchPage
