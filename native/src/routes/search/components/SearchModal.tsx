import * as React from 'react'
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'
import { CategoriesRouteInformationType, CategoriesMapModel, CategoryModel, SEARCH_FINISHED_SIGNAL_NAME, SEARCH_ROUTE } from 'api-client'
import CategoryList, { ListEntryType } from '../../../modules/categories/components/CategoryList'
import styled from 'styled-components/native'
import { TFunction } from 'react-i18next'
import SearchHeader from './SearchHeader'
import { ThemeType } from 'build-configs/ThemeType'
import normalizeSearchString from '../../../modules/common/normalizeSearchString'
import { Parser } from 'htmlparser2'
import dimensions from '../../../modules/theme/constants/dimensions'
import { CATEGORIES_ROUTE } from 'api-client/src/routes'
import { RouteInformationType } from 'api-client/src/routes/RouteInformationTypes'
import FeedbackContainer from '../../../modules/feedback/FeedbackContainer'
import SadIcon from '../../../modules/common/components/assets/smile-sad.svg'
import sendTrackingSignal from '../../../modules/endpoint/sendTrackingSignal'
import { urlFromRouteInformation } from '../../../modules/navigation/url'

const Wrapper = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.colors.backgroundColor};
`
const ThemedText = styled.Text`
  display: flex;
  text-align: left;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
`
const Heading = styled(ThemedText)`
  font-size: 16px;
  text-align: center;
  padding: 10px 30px 30px;
`
const SadIconContainer = styled.Image`
  margin: 0px auto 10px;
`
export type PropsType = {
  categories: CategoriesMapModel | null
  navigateTo: (arg0: RouteInformationType) => void
  theme: ThemeType
  language: string
  cityCode: string
  closeModal: (query: string) => void
  navigateToLink: (url: string, language: string, shareUrl: string) => void
  t: TFunction<'search'>
}
type SearchStateType = {
  query: string
}

class SearchModal extends React.Component<PropsType, SearchStateType> {
  state = {
    query: ''
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
            path: category.path
          },
          subCategories: []
        })
      )
      .sort((category1, category2) => category1.model.title.localeCompare(category2.model.title))
    // find all categories whose contents but not titles include the filter text and sort them lexicographically
    const categoriesWithContent = categoriesArray
      .filter(category => !normalizeSearchString(category.title).includes(normalizedFilter) && !category.isRoot())
      .map(
        (category: CategoryModel): ListEntryType => {
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
        }
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

  onItemPress = (category: { path: string }) => {
    const { cityCode, language, navigateTo } = this.props
    const { query } = this.state
    const routeInformation: CategoriesRouteInformationType = {
      route: CATEGORIES_ROUTE,
      cityContentPath: category.path,
      cityCode,
      languageCode: language
    }
    sendTrackingSignal({
      signal: {
        name: SEARCH_FINISHED_SIGNAL_NAME,
        query,
        url: urlFromRouteInformation(routeInformation)
      }
    })
    navigateTo({
      route: CATEGORIES_ROUTE,
      cityCode,
      languageCode: language,
      cityContentPath: category.path
    })
  }

  onClose = () => {
    const { query } = this.state
    sendTrackingSignal({
      signal: {
        name: SEARCH_FINISHED_SIGNAL_NAME,
        query,
        url: null
      }
    })
    this.props.closeModal(query)
  }

  onSearchChanged = (query: string) => {
    this.setState({
      query
    })
  }

  renderContent = () => {
    const { language, cityCode, theme, categories, navigateToLink, t } = this.props
    const { query } = this.state
    const minHeight = dimensions.categoryListItem.iconSize + dimensions.categoryListItem.margin * 2

    if (!categories) {
      return <ActivityIndicator size='large' color='#0000ff' />
    }

    const filteredCategories = this.findCategories(categories)
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1
        }}
        keyboardShouldPersistTaps='always'>
        {/* The minHeight is needed to circumvent a bug that appears when there is only one search result.
             See NATIVE-430 for reference. */}
        <View
          style={{
            minHeight: minHeight
          }}>
          <CategoryList
            categories={filteredCategories}
            navigateToLink={navigateToLink}
            query={query}
            onItemPress={this.onItemPress}
            theme={theme}
            language={language}
          />
        </View>
        {filteredCategories.length === 0 && (
          <>
            <SadIconContainer source={SadIcon} />
            <Heading theme={theme}>{t('feedback:nothingFound')}</Heading>
          </>
        )}
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

  render() {
    const { theme, t } = this.props
    const { query } = this.state
    return (
      <Wrapper theme={theme}>
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
            flex: 1
          }}>
          {this.renderContent()}
        </KeyboardAvoidingView>
      </Wrapper>
    )
  }
}

export default SearchModal
