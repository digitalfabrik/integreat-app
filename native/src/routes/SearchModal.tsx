import * as React from 'react'
import { ReactNode } from 'react'
import { TFunction } from 'react-i18next'
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'
import styled from 'styled-components/native'

import {
  CategoriesRouteInformationType,
  CategoriesMapModel,
  CategoryModel,
  SEARCH_FINISHED_SIGNAL_NAME,
  SEARCH_ROUTE,
  CATEGORIES_ROUTE,
  normalizeSearchString,
  RouteInformationType,
  parseHTML,
} from 'api-client'
import { ThemeType } from 'build-configs'

import CategoryList, { ListEntryType } from '../components/CategoryList'
import FeedbackContainer from '../components/FeedbackContainer'
import NothingFound from '../components/NothingFound'
import SearchHeader from '../components/SearchHeader'
import dimensions from '../constants/dimensions'
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
  categories: CategoriesMapModel | null
  navigateTo: (routeInformation: RouteInformationType) => void
  theme: ThemeType
  language: string
  cityCode: string
  closeModal: (query: string) => void
  t: TFunction<'search'>
}
type SearchStateType = {
  query: string
}

class SearchModal extends React.Component<PropsType, SearchStateType> {
  state = {
    query: '',
  }

  findCategories(categories: CategoriesMapModel): Array<ListEntryType> {
    const { query } = this.state
    const normalizedFilter = normalizeSearchString(query)
    const categoriesArray = categories.toArray()
    // find all categories whose titles include the filter text and sort them lexicographically
    const categoriesWithTitle = categoriesArray
      .filter(category => normalizeSearchString(category.title).includes(normalizedFilter) && !category.isRoot())
      .map(
        (category: CategoryModel): ListEntryType => ({
          model: {
            title: category.title,
            thumbnail: category.thumbnail,
            path: category.path,
            contentWithoutHtml: parseHTML(category.content),
            titleMatch: true,
          },
          subCategories: [],
        })
      )
      .sort((category1, category2) => category1.model.title.localeCompare(category2.model.title))
    // find all categories whose contents but not titles include the filter text and sort them lexicographically
    const categoriesWithContent = categoriesArray
      .filter(category => !normalizeSearchString(category.title).includes(normalizedFilter) && !category.isRoot())
      .map(
        (category: CategoryModel): ListEntryType => ({
          model: {
            path: category.path,
            thumbnail: category.thumbnail,
            title: category.title,
            contentWithoutHtml: parseHTML(category.content),
          },
          subCategories: [],
        })
      )
      .filter(
        category =>
          category.model.contentWithoutHtml &&
          category.model.contentWithoutHtml.length > 0 &&
          normalizeSearchString(category.model.contentWithoutHtml).includes(normalizedFilter)
      )
      .sort((category1, category2) => category1.model.title.localeCompare(category2.model.title))
    // return all categories from above and remove the root category
    return categoriesWithTitle.concat(categoriesWithContent)
  }

  onItemPress = (category: { path: string }): void => {
    const { cityCode, language, navigateTo } = this.props
    const { query } = this.state
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

  onClose = (): void => {
    const { query } = this.state
    const { closeModal } = this.props
    sendTrackingSignal({
      signal: {
        name: SEARCH_FINISHED_SIGNAL_NAME,
        query,
        url: null,
      },
    })
    closeModal(query)
  }

  onSearchChanged = (query: string): void => {
    this.setState({
      query,
    })
  }

  renderContent = (): ReactNode => {
    const { language, cityCode, theme, categories } = this.props
    const { query } = this.state
    const minHeight = dimensions.categoryListItem.iconSize + dimensions.categoryListItem.margin * 2

    if (!categories) {
      return <ActivityIndicator size='large' color='#0000ff' />
    }

    const filteredCategories = this.findCategories(categories)
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps='always'>
        {/* The minHeight is needed to circumvent a bug that appears when there is only one search result.
             See NATIVE-430 for reference. */}
        <View
          style={{
            minHeight,
          }}>
          <CategoryList
            categories={filteredCategories}
            query={query}
            onItemPress={this.onItemPress}
            language={language}
          />
        </View>
        {filteredCategories.length === 0 && <NothingFound />}
        <FeedbackContainer
          routeType={SEARCH_ROUTE}
          isSearchFeedback
          isPositiveFeedback={false}
          language={language}
          cityCode={cityCode}
          query={query}
          theme={theme}
        />
      </ScrollView>
    )
  }

  render(): ReactNode {
    const { theme, t } = this.props
    const { query } = this.state
    return (
      <Wrapper theme={theme} {...testID('Search-Page')}>
        <SearchHeader
          theme={theme}
          query={query}
          closeSearchBar={this.onClose}
          onSearchChanged={this.onSearchChanged}
          t={t}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{
            flex: 1,
          }}>
          {this.renderContent()}
        </KeyboardAvoidingView>
      </Wrapper>
    )
  }
}

export default SearchModal
