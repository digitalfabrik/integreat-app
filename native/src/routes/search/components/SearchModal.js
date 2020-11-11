// @flow

import * as React from 'react'
import { CategoriesMapModel, CategoryModel } from 'api-client'
import type { ListEntryType } from '../../../modules/categories/components/CategoryList'
import CategoryList from '../../../modules/categories/components/CategoryList'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import SearchHeader from './SearchHeader'
import { ActivityIndicator, ScrollView, View } from 'react-native'
import type { NavigationStackProp } from 'react-navigation-stack'
import type { ThemeType } from '../../../modules/theme/constants'
import type { NavigateToCategoryParamsType } from '../../../modules/app/createNavigateToCategory'
import type { TFunction } from 'react-i18next'
import SpaceBetween from '../../../modules/common/components/SpaceBetween'
import SearchFeedbackBox from './SearchFeedbackBox'
import normalizeSearchString from '../../../modules/common/normalizeSearchString'
import { Parser } from 'htmlparser2'

const Wrapper: StyledComponent<{}, ThemeType, *> = styled.View`
  position: absolute;  
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.colors.backgroundColor};
`

export type PropsType = {|
  categories: CategoriesMapModel | null,
  navigateToCategory: NavigateToCategoryParamsType => void,
  theme: ThemeType,
  language: string,
  cityCode: string,
  closeModal: () => void,
  navigation: NavigationStackProp<*>,
  t: TFunction,
  sendFeedback: (comment: string, query: string) => Promise<void>
|}

type StateType = {|
  query: string
|}

class SearchModal extends React.Component<PropsType, StateType> {
  state = { query: '' }

  findCategories (categories: CategoriesMapModel): Array<ListEntryType> {
    const { query } = this.state
    const normalizedFilter = normalizeSearchString(query)
    const categoriesArray = categories.toArray()

    // find all categories whose titles include the filter text and sort them lexicographically
    const categoriesWithTitle = categoriesArray
      .filter(category => normalizeSearchString(category.title).includes(normalizedFilter) && !category.isRoot())
      .map((category: CategoryModel): ListEntryType => ({
        model: {
          title: category.title,
          thumbnail: category.thumbnail,
          path: category.path
        },
        subCategories: []
      })

      )
      .sort((category1, category2) => category1.model.title.localeCompare(category2.model.title))

    // find all categories whose contents but not titles include the filter text and sort them lexicographically
    const categoriesWithContent = categoriesArray
      .filter(category => !normalizeSearchString(category.title).includes(normalizedFilter) && !category.isRoot())
      .map((category: CategoryModel): ListEntryType => {
        const contentWithoutHtml = []
        const parser = new Parser({ ontext (data: string) { contentWithoutHtml.push(data) } })
        parser.write(category.content)
        parser.end()
        return {
          model: {
            path: category.path,
            thumbnail: category.thumbnail,
            title: category.title,
            contentWithoutHtml: contentWithoutHtml.join(' ')
          },
          subCategories: []
        }
      })
      .filter(category => category.model.contentWithoutHtml && category.model.contentWithoutHtml.length > 0 &&
        normalizeSearchString(category.model.contentWithoutHtml).includes(normalizedFilter))
      .sort((category1, category2) => category1.model.title.localeCompare(category2.model.title))

    // return all categories from above and remove the root category
    return categoriesWithTitle
      .concat(categoriesWithContent)
  }

  onItemPress = (category: { path: string }) => {
    const { cityCode, language, navigateToCategory } = this.props

    navigateToCategory({
      cityCode,
      language,
      path: category.path
    })
  }

  onSearchChanged = (query: string) => {
    this.setState({ query })
  }

  renderContent = () => {
    const { language, theme, categories, t, sendFeedback } = this.props
    const { query } = this.state

    const nativeDimensions = theme.dimensions.native
    const minHeight = nativeDimensions.categoryListItem.iconSize + nativeDimensions.categoryListItem.margin * 2

    if (!categories) {
      return <ActivityIndicator size='large' color='#0000ff' />
    }

    const filteredCategories = this.findCategories(categories)
    return <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='always'>
      <SpaceBetween>
        {/* The minHeight is needed to circumvent a bug that appears when there is only one search result.
              See NATIVE-430 for reference. */}
        <View style={{ minHeight: minHeight }}>
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
    const { theme, closeModal, t } = this.props
    const { query } = this.state
    return (
      <Wrapper theme={theme}>
        <SearchHeader theme={theme}
                      query={query}
                      closeSearchBar={closeModal}
                      onSearchChanged={this.onSearchChanged}
                      t={t} />
        {this.renderContent()}
      </Wrapper>
    )
  }
}

export default SearchModal
