import React, { ReactElement, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { pathnameFromRouteInformation, searchCategories, SEARCH_ROUTE } from 'shared'
import { createCategoriesEndpoint, useLoadFromEndpoint } from 'shared/api'

import { CityRouteProps } from '../CityContentSwitcher'
import CityContentLayout, { CityContentLayoutProps } from '../components/CityContentLayout'
import Failure from '../components/Failure'
import FailureSwitcher from '../components/FailureSwitcher'
import FeedbackSearch from '../components/FeedbackSearch'
import Helmet from '../components/Helmet'
import LoadingSpinner from '../components/LoadingSpinner'
import SearchInput from '../components/SearchInput'
import SearchListItem from '../components/SearchListItem'
import { helpers } from '../constants/theme'
import { cmsApiBaseUrl } from '../constants/urls'

const List = styled.ul`
  list-style-type: none;

  & a {
    ${helpers.removeLinkHighlighting}
  }
`

const SearchPage = ({ city, cityCode, languageCode, pathname }: CityRouteProps): ReactElement | null => {
  const query = new URLSearchParams(useLocation().search).get('query') ?? ''
  const [filterText, setFilterText] = useState<string>(query)
  const { t } = useTranslation('search')
  const navigate = useNavigate()

  const {
    data: categories,
    loading,
    error: categoriesError,
  } = useLoadFromEndpoint(createCategoriesEndpoint, cmsApiBaseUrl, {
    city: cityCode,
    language: languageCode,
  })
  const searchResults = useMemo(() => (categories ? searchCategories(categories, query) : null), [categories, query])

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

  if (loading) {
    return (
      <CityContentLayout isLoading {...locationLayoutParams}>
        <LoadingSpinner />
      </CityContentLayout>
    )
  }

  if (!searchResults) {
    const error = categoriesError || new Error('Categories should not be null!')
    return (
      <CityContentLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcher error={error} />
      </CityContentLayout>
    )
  }

  const handleFilterTextChanged = (filterText: string): void => {
    setFilterText(filterText)
    const appendToUrl = filterText.length !== 0 ? `?query=${filterText}` : ''
    navigate(`${pathname}/${appendToUrl}`, { replace: true })
  }

  const pageTitle = `${t('pageTitle')} - ${city.name}`

  return (
    <CityContentLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={city} />
      <SearchInput
        filterText={filterText}
        placeholderText={t('searchPlaceholder')}
        onFilterTextChange={handleFilterTextChanged}
        spaceSearch
      />
      <List>
        {searchResults.map(({ category, contentWithoutHtml }) => (
          <SearchListItem
            key={category.path}
            query={query}
            category={category}
            contentWithoutHtml={contentWithoutHtml}
          />
        ))}
      </List>
      {searchResults.length === 0 && <Failure errorMessage='search:nothingFound' />}
      <FeedbackSearch
        cityCode={cityCode}
        languageCode={languageCode}
        resultsFound={searchResults.length !== 0}
        query={filterText}
      />
    </CityContentLayout>
  )
}

export default SearchPage
