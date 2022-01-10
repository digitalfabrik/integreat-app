import { Parser } from 'htmlparser2'
import React, { ReactElement, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  CategoryModel,
  createCategoriesEndpoint,
  pathnameFromRouteInformation,
  SEARCH_ROUTE,
  useLoadFromEndpoint
} from 'api-client'

import { CityRouteProps } from '../CityContentSwitcher'
import CategoryList from '../components/CategoryList'
import FailureSwitcher from '../components/FailureSwitcher'
import FeedbackSearch from '../components/FeedbackSearch'
import Helmet from '../components/Helmet'
import LoadingSpinner from '../components/LoadingSpinner'
import LocationLayout from '../components/LocationLayout'
import SearchInput from '../components/SearchInput'
import { cmsApiBaseUrl } from '../constants/urls'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { normalizeSearchString } from '../utils/stringUtils'
import { RouteProps } from './index'

type CategoryEntryType = { model: CategoryModel; contentWithoutHtml?: string; subCategories: Array<CategoryModel> }

const noop = () => undefined

type PropsType = CityRouteProps & RouteProps<typeof SEARCH_ROUTE>

const SearchPage = ({ match, cityModel, location, languages, history }: PropsType): ReactElement => {
  const query = new URLSearchParams(location.search).get('query') ?? ''
  const { cityCode, languageCode } = match.params
  const [filterText, setFilterText] = useState<string>(query)
  const { viewportSmall } = useWindowDimensions()
  const { t } = useTranslation('search')

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
  let contentWithoutHtml: string[] = []
  const parser = new Parser({
    ontext: (text: string) => {
      contentWithoutHtml.push(text)
    }
  })
  const categoriesWithContent = categories
    .toArray()
    .filter((category: CategoryModel) => !normalizeSearchString(category.title).includes(normalizedFilterText))
    .map((category: CategoryModel): CategoryEntryType => {
      contentWithoutHtml = []
      parser.write(category.content)

      return {
        model: category,
        contentWithoutHtml: contentWithoutHtml.join(' '),
        subCategories: []
      }
    })
    .filter(
      (categoryEntry: CategoryEntryType) =>
        categoryEntry.contentWithoutHtml &&
        normalizeSearchString(categoryEntry.contentWithoutHtml).includes(normalizedFilterText)
    )
    .sort((category1: CategoryEntryType, category2: CategoryEntryType) =>
      category1.model.title.localeCompare(category2.model.title)
    )

  parser.end()

  // return all categories from above and remove the root category
  const searchResults = categoriesWithTitle
    .filter((category: CategoryModel) => !category._root)
    .map((category: CategoryModel): CategoryEntryType => ({ model: category, subCategories: [] }))
    .concat(categoriesWithContent)

  const handleFilterTextChanged = (filterText: string): void => {
    setFilterText(filterText)
    const appendToUrl = filterText.length !== 0 ? `?query=${filterText}` : ''
    history.replace(`${location.pathname}${appendToUrl}`)
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
      <CategoryList categories={searchResults} query={filterText} onInternalLinkClick={noop} />
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
