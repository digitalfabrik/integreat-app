import React, { ReactElement, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  CategoryModel,
  createCategoriesEndpoint,
  parseHTML,
  pathnameFromRouteInformation,
  SEARCH_ROUTE,
  useLoadFromEndpoint
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
import { normalizeSearchString } from '../utils/stringUtils'

type CategoryEntryType = { model: CategoryModel; contentWithoutHtml?: string; subCategories: Array<CategoryModel> }

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
        language: languageCode
      }),
    [cityCode, languageCode]
  )
  const { data: categories, loading, error: categoriesError } = useLoadFromEndpoint(requestCategories)

  const languageChangePaths = languages.map(({ code, name }) => ({
    path: pathnameFromRouteInformation({ route: SEARCH_ROUTE, cityCode, languageCode: code }),
    name,
    code
  }))

  const locationLayoutParams = {
    cityModel,
    viewportSmall,
    feedbackTargetInformation: null,
    languageChangePaths,
    route: SEARCH_ROUTE,
    languageCode
  }

  if (loading) {
    return (
      <LocationLayout isLoading {...locationLayoutParams}>
        <LoadingSpinner />
      </LocationLayout>
    )
  }

  if (!categories) {
    const error = categoriesError || new Error('Categories should not be null!')
    return (
      <LocationLayout isLoading={false} {...locationLayoutParams}>
        <FailureSwitcher error={error} />
      </LocationLayout>
    )
  }

  const normalizedFilterText = normalizeSearchString(filterText)

  // find all categories whose titles include the filter text and sort them lexicographically
  const categoriesWithTitle = categories
    .toArray()
    .filter((category: CategoryModel) => normalizeSearchString(category.title).includes(normalizedFilterText))
    .sort((category1: CategoryModel, category2: CategoryModel) => category1.title.localeCompare(category2.title))

  // find all categories whose contents but not titles include the filter text and sort them lexicographically
  const categoriesWithContent = categories
    .toArray()
    .filter((category: CategoryModel) => !normalizeSearchString(category.title).includes(normalizedFilterText))
    .map(
      (category: CategoryModel): CategoryEntryType => ({
        model: category,
        contentWithoutHtml: parseHTML(category.content),
        subCategories: []
      })
    )
    .filter(
      (categoryEntry: CategoryEntryType) =>
        categoryEntry.contentWithoutHtml &&
        normalizeSearchString(categoryEntry.contentWithoutHtml).includes(normalizedFilterText)
    )
    .sort((category1: CategoryEntryType, category2: CategoryEntryType) =>
      category1.model.title.localeCompare(category2.model.title)
    )

  // return all categories from above and remove the root category
  const searchResults = categoriesWithTitle
    .filter((category: CategoryModel) => !category._root)
    .map((category: CategoryModel): CategoryEntryType => ({ model: category, subCategories: [] }))
    .concat(categoriesWithContent)

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
      <CategoryList categories={searchResults} query={filterText} onInternalLinkClick={navigate} />
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
