import { TFunction } from 'i18next'
import React, { ReactElement, useMemo, useState } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import styled from 'styled-components/native'

import {
  CategoriesRouteInformationType,
  CategoriesMapModel,
  SEARCH_FINISHED_SIGNAL_NAME,
  SEARCH_ROUTE,
  CATEGORIES_ROUTE,
  RouteInformationType,
  searchCategories,
  CategorySearchResult,
  CategoryModel,
} from 'api-client'
import { ThemeType } from 'build-configs'

import FeedbackContainer from '../components/FeedbackContainer'
import HorizontalLine from '../components/HorizontalLine'
import List from '../components/List'
import NothingFound from '../components/NothingFound'
import SearchHeader from '../components/SearchHeader'
import SearchListItem from '../components/SearchListItem'
import useResourceCache from '../hooks/useResourceCache'
import { urlFromRouteInformation } from '../navigation/url'
import testID from '../testing/testID'
import sendTrackingSignal from '../utils/sendTrackingSignal'

const Wrapper = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.colors.backgroundColor};
`

export type SearchModalProps = {
  categories: CategoriesMapModel
  navigateTo: (routeInformation: RouteInformationType) => void
  theme: ThemeType
  languageCode: string
  cityCode: string
  closeModal: (query: string) => void
  t: TFunction<'search'>
  initialSearchText: string
}

const SearchModal = ({
  categories,
  navigateTo,
  theme,
  languageCode,
  cityCode,
  closeModal,
  t,
  initialSearchText = '',
}: SearchModalProps): ReactElement => {
  const [query, setQuery] = useState<string>(initialSearchText)
  const resourceCache = useResourceCache({ cityCode, languageCode })

  const searchResults = useMemo(() => searchCategories(categories, query), [categories, query])

  const onItemPress = (category: CategoryModel): void => {
    const routeInformation: CategoriesRouteInformationType = {
      route: CATEGORIES_ROUTE,
      cityContentPath: category.path,
      cityCode,
      languageCode,
    }
    sendTrackingSignal({
      signal: {
        name: SEARCH_FINISHED_SIGNAL_NAME,
        query,
        url: urlFromRouteInformation(routeInformation),
      },
    })
    navigateTo({
      route: CATEGORIES_ROUTE,
      cityCode,
      languageCode,
      cityContentPath: category.path,
    })
  }

  const onClose = (): void => {
    sendTrackingSignal({
      signal: {
        name: SEARCH_FINISHED_SIGNAL_NAME,
        query,
        url: null,
      },
    })
    closeModal(query)
  }

  const renderItem = ({ item }: { item: CategorySearchResult }) => (
    <SearchListItem
      key={item.category.path}
      category={item.category}
      resourceCache={resourceCache[item.category.path] ?? {}}
      contentWithoutHtml={item.contentWithoutHtml}
      language={languageCode}
      query={query}
      onItemPress={onItemPress}
    />
  )

  return (
    <Wrapper {...testID('Search-Page')}>
      <SearchHeader theme={theme} query={query} closeSearchBar={onClose} onSearchChanged={setQuery} t={t} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <List
          items={searchResults}
          renderItem={renderItem}
          accessibilityLabel={t('searchResultsCount', { count: searchResults.length })}
          noItemsMessage={
            <>
              <NothingFound />
              <HorizontalLine />
              <FeedbackContainer routeType={SEARCH_ROUTE} language={languageCode} cityCode={cityCode} query={query} />
            </>
          }
        />
      </KeyboardAvoidingView>
    </Wrapper>
  )
}

export default SearchModal
