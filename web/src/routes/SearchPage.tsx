import React, { ReactElement, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import {
  createCategoriesEndpoint,
  pathnameFromRouteInformation,
  searchCategories,
  SEARCH_ROUTE,
  useLoadFromEndpoint,
} from 'api-client'

import { CityRouteProps } from '../CityContentSwitcher'
import CityContentLayout from '../components/CityContentLayout'
import Failure from '../components/Failure'
import FailureSwitcher from '../components/FailureSwitcher'
import FeedbackSearch from '../components/FeedbackSearch'
import Helmet from '../components/Helmet'
import LoadingSpinner from '../components/LoadingSpinner'
import SearchInput from '../components/SearchInput'
import SearchListItem from '../components/SearchListItem'
import { helpers } from '../constants/theme'
import { cmsApiBaseUrl } from '../constants/urls'
import useWindowDimensions from '../hooks/useWindowDimensions'

const List = styled.ul`
  list-style-type: none;
  & a {
    ${helpers.removeLinkHighlighting}
  }
`

const SearchPage = ({ cityModel, languages, cityCode, languageCode, pathname }: CityRouteProps): ReactElement => {
  const query = new URLSearchParams(useLocation().search).get('query') ?? ''
  const [filterText, setFilterText] = useState<string>(query)
  const { viewportSmall } = useWindowDimensions()
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

  const languageChangePaths = languages.map(({ code, name }) => ({
    path: pathnameFromRouteInformation({ route: SEARCH_ROUTE, cityCode, languageCode: code }),
    name,
    code,
  }))

  const locationLayoutParams = {
    cityModel,
    viewportSmall,
    feedbackTargetInformation: null,
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

  const pageTitle = `${t('pageTitle')} - ${cityModel.name}`

  return (
    <CityContentLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={cityModel} />
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
      {searchResults.length === 0 && <Failure errorMessage='nothingFound' t={t} />}
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
