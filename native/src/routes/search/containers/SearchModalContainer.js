// @flow

import { connect } from 'react-redux'
import type { Dispatch } from 'redux'
import type { StateType } from '../../../modules/app/StateType'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import withTheme from '../../../modules/theme/hocs/withTheme'
import SearchModal from '../components/SearchModal'
import { CategoriesMapModel, createFeedbackEndpoint, SEARCH_FEEDBACK_TYPE } from 'api-client'
import { withTranslation } from 'react-i18next'
import determineApiUrl from '../../../modules/endpoint/determineApiUrl'
import type {
  NavigationPropType,
  RoutePropType
} from '../../../modules/app/constants/NavigationTypes'
import navigateToLink from '../../../modules/navigation/navigateToLink'
import React, { useCallback } from 'react'
import type { SearchRouteType } from 'api-client/src/routes'
import createNavigate from '../../../modules/navigation/createNavigate'

type OwnPropsType = {|
  route: RoutePropType<SearchRouteType>,
  navigation: NavigationPropType<SearchRouteType>
|}

export type PropsType = {|
  ...OwnPropsType,
  dispatch: Dispatch<StoreActionType>,
  categories: CategoriesMapModel | null,
  language: string,
  cityCode: ?string,
  closeModal: () => void,
  sendFeedback: (comment: string, query: string) => Promise<void>
|}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType) => {
  const cityCode = state.cityContent?.city
  return {
    categories: state.cityContent?.searchRoute?.categoriesMap || null,
    language: state.contentLanguage,
    cityCode,
    closeModal: () => { ownProps.navigation.goBack() },
    sendFeedback: async (comment: string, query: string) => {
      if (!cityCode) {
        return
      }
      const apiUrlOverride = await determineApiUrl()
      await createFeedbackEndpoint(apiUrlOverride).request({
        feedbackType: SEARCH_FEEDBACK_TYPE,
        isPositiveRating: false,
        comment,
        city: cityCode,
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
    const navigateTo = createNavigate(dispatch, navigation)
    navigateToLink(url, navigation, language, navigateTo, shareUrl)
  }, [dispatch, navigation])

  return <ThemedTranslatedSearch
    {...rest}
    navigateToLink={navigateToLinkProp}
    navigateTo={createNavigate(dispatch, navigation)} />
}

export default connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps, mapDispatchToProps)(SearchModalContainer)
