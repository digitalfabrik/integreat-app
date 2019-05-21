// @flow

import * as React from 'react'
import { CategoriesMapModel, CategoryModel } from '@integreat-app/integreat-api-client'
import CategoryList from '../../../modules/categories/components/CategoryList'
import styled from 'styled-components/native'
import SearchHeader from './SearchHeader'
import { InteractionManager, ScrollView, ActivityIndicator } from 'react-native'
import type { StoreActionType } from '../../../modules/app/StoreActionType'

const Wrapper = styled.View`
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
  navigateToCategory: (cityCode: string, language: string, path: string) => StoreActionType,
  theme: any,
  language: string | null,
  cityCode: string | null,
  closeModal: () => void,
  navigation: any
|}

type StateType = {|
  query: string
|}

class SearchModal extends React.Component<PropsType, StateType> {
  static navigationOptions = {}

  constructor () {
    super()
    this.state = {query: ''}
  }

  findCategories (categories: CategoriesMapModel): Array<CategoryListItemType> {
    const {query} = this.state
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
      .map(category => ({model: category, subCategories: []}))
  }

  onItemPress = (category: { path: string }) => {
    const {cityCode, language, navigateToCategory, closeModal} = this.props

    if (!language || !cityCode) {
      throw new Error('Value is unexpectedly null') // fixme: This should be handled properly if this is even possible
    }

    navigateToCategory(cityCode, language, category.path)
    InteractionManager.runAfterInteractions(() => closeModal())
  }

  onSearchChanged = (query: string) => {
    this.setState({query})
  }

  renderContent = () => {
    const {theme, categories} = this.props
    const {query} = this.state

    if (!categories) {
      return <ActivityIndicator size='large' color='#0000ff' />
    }

    const filteredCategories = this.findCategories(categories)
    return (
      <ScrollView theme={theme}>
        <CategoryList categories={filteredCategories} query={query} onItemPress={this.onItemPress} theme={theme} />
      </ScrollView>
    )
  }

  render () {
    const {theme, closeModal} = this.props
    const {query} = this.state
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
