// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'
import { CategoriesMapModel, CategoryModel, CityModel, SEARCH_ROUTE } from 'api-client'
import type { ListEntryType } from '../../../modules/categories/components/CategoryList'
import CategoryList from '../../../modules/categories/components/CategoryList'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import { type TFunction, withTranslation } from 'react-i18next'

import SearchHeader from './SearchHeader'
import type { ThemeType } from 'build-configs/ThemeType'
import normalizeSearchString from '../../../modules/common/normalizeSearchString'
import { Parser } from 'htmlparser2'
import dimensions from '../../../modules/theme/constants/dimensions'
import { CATEGORIES_ROUTE } from 'api-client/src/routes'
import type { RouteInformationType } from 'api-client/src/routes/RouteInformationTypes'
import FeedbackContainer from '../../../modules/feedback/FeedbackContainer'
import type { StateType } from '../../../modules/app/StateType'
import type { PropsType as FeedbackContainerPropsType } from '../../../modules/feedback/FeedbackContainer'
import type { StatusPropsType } from '../../../modules/endpoint/hocs/withPayloadProvider'


const Wrapper: StyledComponent<{||}, ThemeType, *> = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.colors.backgroundColor};
`

export type PropsType = {|
  categories: CategoriesMapModel | null,
  navigateTo: RouteInformationType => void,
  theme: ThemeType,
  language: string,
  cityCode: string,
  closeModal: () => void,
  navigateToLink: (url: string, language: string, shareUrl: string) => void,
  t: TFunction,
  sendFeedback: (comment: string, query: string) => Promise<void>,
  cities: $ReadOnlyArray<CityModel>
|}

type SearchStateType = {|
  query: string
|}

const TranslatedFeedbackContainer = withTranslation<FeedbackContainerPropsType>('feedback')(FeedbackContainer)

function mapStateToProps(state: StateType): StatusPropsType<PropsType> {
  if (state.cities.status === 'error') {
    return { status: 'error', message: state.cities.message, code: state.cities.code }
  }

  if (state.cities.status === 'loading') {
    return { status: 'loading', progress: 0 }
  }

  return {
    status: 'success',
    cities: state.cities.models
  }
}

class SearchModal extends React.Component<PropsType, SearchStateType> {
  state = { query: '' }

  findCategories(categories: CategoriesMapModel): Array<ListEntryType> {
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
      }))
      .sort((category1, category2) => category1.model.title.localeCompare(category2.model.title))

    // find all categories whose contents but not titles include the filter text and sort them lexicographically
    const categoriesWithContent = categoriesArray
      .filter(category => !normalizeSearchString(category.title).includes(normalizedFilter) && !category.isRoot())
      .map((category: CategoryModel): ListEntryType => {
        const contentWithoutHtml = []
        const parser = new Parser({
          ontext(data: string) {
            contentWithoutHtml.push(data)
          }
        })
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

  onItemPress = (category: { path: string, ... }) => {
    const { cityCode, language, navigateTo } = this.props

    navigateTo({
      route: CATEGORIES_ROUTE,
      cityCode,
      languageCode: language,
      cityContentPath: category.path
    })
  }

  onSearchChanged = (query: string) => {
    this.setState({ query })
  }

  renderContent = () => {
    const { language, cityCode, theme, categories, navigateToLink } = this.props
    const { query } = this.state

    const minHeight = dimensions.categoryListItem.iconSize + dimensions.categoryListItem.margin * 2

    if (!categories) {
      return <ActivityIndicator size='large' color='#0000ff' />
    }

    const filteredCategories = this.findCategories(categories)
    const feedbackOrigin = filteredCategories.length !== 0 ? 'searchInformationNotFound' : 'searchNothingFound'

    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='always'>
        {/* The minHeight is needed to circumvent a bug that appears when there is only one search result.
              See NATIVE-430 for reference. */}
        <View style={{ minHeight: minHeight }}>
          <CategoryList
            categories={filteredCategories}
            navigateToLink={navigateToLink}
            query={query}
            onItemPress={this.onItemPress}
            theme={theme}
            language={language}
          />
        </View>
        <TranslatedFeedbackContainer
          routeType={SEARCH_ROUTE}
          feedbackOrigin={feedbackOrigin}
          language={language}
          cityCode={cityCode}
          cities={this.props.cities}
          query={query}
        />
      </ScrollView>
    )
  }

  render() {
    const { theme, closeModal, t } = this.props
    const { query } = this.state
    return (
      <Wrapper theme={theme}>
        <SearchHeader
          theme={theme}
          query={query}
          closeSearchBar={closeModal}
          onSearchChanged={this.onSearchChanged}
          t={t}
        />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} style={{ flex: 1 }}>
          {this.renderContent()}
        </KeyboardAvoidingView>
      </Wrapper>
    )
  }
}

export default connect(mapStateToProps)(SearchModal)
