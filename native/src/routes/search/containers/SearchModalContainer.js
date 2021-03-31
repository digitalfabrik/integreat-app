// @flow

import { connect } from 'react-redux'
import type { Dispatch } from 'redux'
import type { StateType } from '../../../modules/app/StateType'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import withTheme from '../../../modules/theme/hocs/withTheme'
import SearchModal, { type PropsType as SearchModalPropsType } from '../components/SearchModal'
import {
  CategoriesMapModel,
  createFeedbackEndpoint,
  SEARCH_FEEDBACK_TYPE,
  SEARCH_FINISHED_SIGNAL_NAME
} from 'api-client'
import { withTranslation, type TFunction } from 'react-i18next'
import determineApiUrl from '../../../modules/endpoint/determineApiUrl'
import type { NavigationPropType, RoutePropType } from '../../../modules/app/constants/NavigationTypes'
import navigateToLink from '../../../modules/navigation/navigateToLink'
import React, { useCallback } from 'react'
import type { SearchRouteType } from 'api-client/src/routes'
import createNavigate from '../../../modules/navigation/createNavigate'
import sendTrackingSignal from '../../../modules/endpoint/sendTrackingSignal'

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
  closeModal: (query: string) => void,
  sendFeedback: (comment: string, query: string) => Promise<void>
|}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType) => {
  const cityCode = state.cityContent?.city
  return {
    categories: state.cityContent?.searchRoute?.categoriesMap || null,
    language: state.contentLanguage,
    cityCode,
    closeModal: (query: string) => {
      sendTrackingSignal({ signal: { name: SEARCH_FINISHED_SIGNAL_NAME, query, url: null } })
      ownProps.navigation.goBack()
    },
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

const ThemedTranslatedSearch = withTheme<$Diff<SearchModalPropsType, {| t: TFunction |}>>(
  withTranslation<SearchModalPropsType>('search')(SearchModal)
)

const SearchModalContainer = (props: PropsType) => {
  const { dispatch, navigation, route, cityCode, ...rest } = props

  const navigateToLinkProp = useCallback(
    (url: string, language: string, shareUrl: string) => {
      const navigateTo = createNavigate(dispatch, navigation)
      navigateToLink(url, navigation, language, navigateTo, shareUrl)
    },
    [dispatch, navigation]
  )

  return cityCode ? (
    <ThemedTranslatedSearch
      cityCode={cityCode}
      navigateToLink={navigateToLinkProp}
      navigateTo={createNavigate(dispatch, navigation)}
      {...rest}
    />
  ) : null
}

export default connect<PropsType, OwnPropsType, _, _, _, _>(mapStateToProps, mapDispatchToProps)(SearchModalContainer)
