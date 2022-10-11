import React, { ReactElement, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  createCategoriesEndpoint,
  pathnameFromRouteInformation,
  searchCategories,
  SEARCH_ROUTE,
  useLoadFromEndpoint,
} from 'api-client'

import { CityRouteProps } from '../CityContentSwitcher'
import CategoryList from '../components/CategoryList'
import Failure from '../components/Failure'
import FailureSwitcher from '../components/FailureSwitcher'
import FeedbackSearch from '../components/FeedbackSearch'
import Helmet from '../components/Helmet'
import LoadingSpinner from '../components/LoadingSpinner'
import LocationLayout from '../components/LocationLayout'
import SearchInput from '../components/SearchInput'
import { cmsApiBaseUrl } from '../constants/urls'
import useWindowDimensions from '../hooks/useWindowDimensions'

const SearchPage = ({ cityModel, languages, cityCode, languageCode, pathname }: CityRouteProps): ReactElement => {
  const query = new URLSearchParams(useLocation().search).get('query') ?? ''
  const [filterText, setFilterText] = useState<string>(query)
  const { viewportSmall } = useWindowDimensions()
  const { t } = useTranslation('search')
  const navigate = useNavigate()

  const requestCategories = useCallback(
    async () =>
      createCategoriesEndpoint(cmsApiBaseUrl).request({
        city: cityCode,
        language: languageCode,
      }),
    [cityCode, languageCode]
  )
  const { data: categories, loading, error: categoriesError } = useLoadFromEndpoint(requestCategories)
  const searchResults = useMemo(
    () => (categories ? searchCategories(categories, query).map(it => ({ ...it, subCategories: [] })) : null),
    [categories, query]
  )

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
      <LocationLayout isLoading {...locationLayoutParams}>
        <LoadingSpinner />
      </LocationLayout>
    )
  }

  if (!searchResults) {
    const error = categoriesError || new Error('Categories should not be null!')
    return (
      <LocationLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcher error={error} />
      </LocationLayout>
    )
  }

  const handleFilterTextChanged = (filterText: string): void => {
    setFilterText(filterText)
    const appendToUrl = filterText.length !== 0 ? `?query=${filterText}` : ''
    navigate(`${pathname}/${appendToUrl}`, { replace: true })
  }

  const pageTitle = `${t('pageTitle')} - ${cityModel.name}`

  return (
    <LocationLayout isLoading={false} {...locationLayoutParams}>
      <Helmet pageTitle={pageTitle} languageChangePaths={languageChangePaths} cityModel={cityModel} />
      <SearchInput
        filterText={filterText}
        placeholderText={t('searchPlaceholder')}
        onFilterTextChange={handleFilterTextChanged}
        spaceSearch
      />
      <CategoryList items={searchResults} query={filterText} onInternalLinkClick={navigate} />
      {searchResults.length === 0 && <Failure errorMessage='nothingFound' t={t} />}
      <FeedbackSearch
        cityCode={cityCode}
        languageCode={languageCode}
        resultsFound={searchResults.length !== 0}
        query={filterText}
      />
    </LocationLayout>
  )
}

export default SearchPage
