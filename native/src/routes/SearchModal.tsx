import React, { ReactElement, useMemo, useState } from 'react'
import { TFunction } from 'react-i18next'
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
} from 'api-client'
import { ThemeType } from 'build-configs'

import CategoryListItem, { CategoryListItemType } from '../components/CategoryListItem'
import FeedbackContainer from '../components/FeedbackContainer'
import List from '../components/List'
import NothingFound from '../components/NothingFound'
import SearchHeader from '../components/SearchHeader'
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

export type PropsType = {
  categories: CategoriesMapModel
  navigateTo: (routeInformation: RouteInformationType) => void
  theme: ThemeType
  language: string
  cityCode: string
  closeModal: (query: string) => void
  t: TFunction<'search'>
}

const SearchModal = ({ categories, navigateTo, theme, language, cityCode, closeModal, t }: PropsType): ReactElement => {
  const [query, setQuery] = useState<string>('')
  const searchResults = useMemo(
    () =>
      searchCategories(categories, query).map(({ category, contentWithoutHtml }) => ({
        title: category.title,
        path: category.path,
        thumbnail: category.thumbnail,
        contentWithoutHtml,
        subCategories: [],
      })),
    [categories, query]
  )

  const onItemPress = (category: { path: string }): void => {
    const routeInformation: CategoriesRouteInformationType = {
      route: CATEGORIES_ROUTE,
      cityContentPath: category.path,
      cityCode,
      languageCode: language,
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
      languageCode: language,
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

  const renderItem = ({ item }: { item: CategoryListItemType }) => (
    <CategoryListItem key={item.path} item={item} language={language} query={query} onItemPress={onItemPress} />
  )
  const Feedback = (
    <FeedbackContainer
      routeType={SEARCH_ROUTE}
      isSearchFeedback
      isPositiveFeedback={false}
      language={language}
      cityCode={cityCode}
      query={query}
      theme={theme}
    />
  )

  return (
    <Wrapper {...testID('Search-Page')}>
      <SearchHeader theme={theme} query={query} closeSearchBar={onClose} onSearchChanged={setQuery} t={t} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <List items={searchResults} renderItem={renderItem} Footer={Feedback} noItemsMessage={<NothingFound />} />
      </KeyboardAvoidingView>
    </Wrapper>
  )
}

export default SearchModal
