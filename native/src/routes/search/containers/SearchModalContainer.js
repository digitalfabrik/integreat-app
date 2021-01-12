// @flow

import { connect } from 'react-redux'
import type { Dispatch } from 'redux'
import type { StateType } from '../../../modules/app/StateType'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import withTheme from '../../../modules/theme/hocs/withTheme'
import createNavigateToCategory from '../../../modules/app/createNavigateToCategory'
import SearchModal from '../components/SearchModal'
import { CategoriesMapModel, createFeedbackEndpoint, SEARCH_FEEDBACK_TYPE } from 'api-client'
import { withTranslation } from 'react-i18next'
import determineApiUrl from '../../../modules/endpoint/determineApiUrl'
import type {
  SearchModalRouteType,
  NavigationPropType,
  RoutePropType
} from '../../../modules/app/components/NavigationTypes'
import { CATEGORIES_ROUTE } from '../../../modules/app/components/NavigationTypes'
import createNavigateToInternalLink from '../../../modules/app/createNavigateToInternalLink'
import navigateToLink from '../../../modules/app/navigateToLink'
import React, { useCallback } from 'react'

type OwnPropsType = {|
  route: RoutePropType<SearchModalRouteType>,
  navigation: NavigationPropType<SearchModalRouteType>
|}

export type PropsType = {|
  ...OwnPropsType,
  dispatch: Dispatch<StoreActionType>,
  categories: CategoriesMapModel | null,
  language: string,
  cityCode: string,
  closeModal: () => void,
  sendFeedback: (comment: string, query: string) => Promise<void>
|}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType) => {
  if (!state.cityContent) {
    throw new Error('CityContent must not be null!')
  }

  const { searchRoute, city } = state.cityContent

  return {
    categories: (searchRoute && searchRoute.categoriesMap) || null,
    language: state.contentLanguage,
    cityCode: city,
    closeModal: () => { ownProps.navigation.goBack() },
    sendFeedback: async (comment: string, query: string) => {
      const apiUrlOverride = await determineApiUrl()
      await createFeedbackEndpoint(apiUrlOverride).request({
        feedbackType: SEARCH_FEEDBACK_TYPE,
        isPositiveRating: false,
        comment,
        city,
        language: state.contentLanguage,
        query
      })
    }
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>) => ({ dispatch })

const ThemedTranslatedSearch = withTheme(
  withTranslation('search')(SearchModal)
)

const SearchModalContainer = (props: PropsType) => {
  const { dispatch, navigation, ...rest } = props

  const navigateToLinkProp = useCallback((url: string, language: string, shareUrl: string) => {
    const navigateToInternalLink = createNavigateToInternalLink(dispatch, navigation)
    navigateToLink(url, navigation, language, navigateToInternalLink, shareUrl || url)
  }, [dispatch, navigation])

  return <ThemedTranslatedSearch
    {...rest}
    navigateToLink={navigateToLinkProp}
    navigateToCategory={createNavigateToCategory(CATEGORIES_ROUTE, dispatch, navigation)} />
}

export default connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps, mapDispatchToProps)(SearchModalContainer)
