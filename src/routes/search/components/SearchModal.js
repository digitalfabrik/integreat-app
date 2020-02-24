// @flow

import * as React from 'react'
import { CategoriesMapModel, CategoryModel } from '@integreat-app/integreat-api-client'
import CategoryList from '../../../modules/categories/components/CategoryList'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import SearchHeader from './SearchHeader'
import { ActivityIndicator, ScrollView, View } from 'react-native'
import type { NavigationScreenProp } from 'react-navigation'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import type { NavigateToCategoryParamsType } from '../../../modules/app/createNavigateToCategory'
import type { TFunction } from 'react-i18next'
import SpaceBetween from '../../../modules/common/components/SpaceBetween'
import SearchFeedbackBox from './SearchFeedbackBox'

const Wrapper: StyledComponent<{}, ThemeType, *> = styled.View`
  position: absolute;  
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.colors.backgroundColor};
`

type CategoryListItemType = {| model: CategoryModel, subCategories: Array<CategoryModel> |}

export type PropsType = {|
  categories: CategoriesMapModel | null,
  navigateToCategory: NavigateToCategoryParamsType => void,
  theme: ThemeType,
  language: string,
  cityCode: string,
  closeModal: () => void,
  navigation: NavigationScreenProp<*>,
  t: TFunction,
  sendFeedback: (comment: string, query: string) => Promise<void>
|}

type StateType = {|
  query: string
|}

class SearchModal extends React.Component<PropsType, StateType> {
  state = { query: '' }

  findCategories (categories: CategoriesMapModel): Array<CategoryListItemType> {
    const { query } = this.state
    const filterText = query.toLowerCase()
    const categoriesArray = categories.toArray()

    // find all categories whose titles include the filter text and sort them lexicographically
    const categoriesWithTitle = categoriesArray
      .filter(category => category.title.toLowerCase().includes(filterText))
      .sort((category1, category2) => category1.title.localeCompare(category2.title))

    // find all categories whose contents but not titles include the filter text and sort them lexicographically
    const categoriesWithContent = categoriesArray
      .filter(category => !category.title.toLowerCase().includes(filterText))
      .filter(category => category.content.toLowerCase().includes(filterText))
      .sort((category1, category2) => category1.title.localeCompare(category2.title))

    // return all categories from above and remove the root category
    return categoriesWithTitle
      .filter(category => !category.isRoot())
      .concat(categoriesWithContent)
      .map(category => ({ model: category, subCategories: [] }))
  }

  onItemPress = (category: { path: string }) => {
    const { cityCode, language, navigateToCategory } = this.props

    navigateToCategory({ cityCode, language, path: category.path })
  }

  onSearchChanged = (query: string) => {
    this.setState({ query })
  }

  renderContent = () => {
    const { language, theme, categories, t, sendFeedback } = this.props
    const { query } = this.state

    if (!categories) {
      return <ActivityIndicator size='large' color='#0000ff' />
    }

    const filteredCategories = this.findCategories(categories)
    return <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <SpaceBetween>
          <View style={{ minHeight: 70 }}>
            <CategoryList categories={filteredCategories} query={query}
                          onItemPress={this.onItemPress}
                          theme={theme} language={language} />
          </View>
          <SearchFeedbackBox t={t} query={query} theme={theme} resultsFound={filteredCategories.length !== 0}
                             sendFeedback={sendFeedback} />
        </SpaceBetween>
      </ScrollView>
  }

  render () {
    const { theme, closeModal } = this.props
    const { query } = this.state
    return (
      <Wrapper theme={theme}>
        <SearchHeader theme={theme}
                      query={query}
                      closeSearchBar={closeModal}
                      onSearchChanged={this.onSearchChanged} />
        {this.renderContent()}
      </Wrapper>
    )
  }
}

export default SearchModal
