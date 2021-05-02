// @flow

import { connect } from 'react-redux'
import type { Dispatch } from 'redux'
import type { StateType } from '../../../modules/app/StateType'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import withTheme from '../../../modules/theme/hocs/withTheme'
import SearchModal, { type PropsType as SearchModalPropsType } from '../components/SearchModal'
import { CategoriesMapModel, CityModel, createFeedbackEndpoint, SEARCH_FEEDBACK_TYPE, SEARCH_ROUTE } from 'api-client'
import { type TFunction, withTranslation } from 'react-i18next'
import determineApiUrl from '../../../modules/endpoint/determineApiUrl'
import type { NavigationPropType, RoutePropType } from '../../../modules/app/constants/NavigationTypes'
import navigateToLink from '../../../modules/navigation/navigateToLink'
import React, { useCallback } from 'react'
import type { SearchRouteType } from 'api-client/src/routes'
import createNavigate from '../../../modules/navigation/createNavigate'
import type { StatusPropsType } from '../../../modules/endpoint/hocs/withPayloadProvider'
import withPayloadProvider from '../../../modules/endpoint/hocs/withPayloadProvider'

type OwnPropsType = {|
  route: RoutePropType<SearchRouteType>,
  navigation: NavigationPropType<SearchRouteType>
|}

type DispatchPropsType = {| dispatch: Dispatch<StoreActionType> |}

export type InnerPropsType = {|
  ...OwnPropsType,
  ...DispatchPropsType,
  categories: CategoriesMapModel | null,
  language: string,
  cityCode?: string,
  closeModal: (query: string) => void,
  sendFeedback: (comment: string, query: string) => Promise<void>,
  cities: $ReadOnlyArray<CityModel>
|}

type StatePropsType = StatusPropsType<InnerPropsType, OwnPropsType>
type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const refreshProps = ownProps
  const cityCode = state.cityContent?.city
  if (state.cities.status === 'error') {
    return { status: 'error', message: state.cities.message, code: state.cities.code, refreshProps }
  }

  if (state.cities.status === 'loading') {
    return { status: 'loading', progress: 0 }
  }

  return {
    status: 'success',
    innerProps: {
      ...ownProps,
      cities: state.cities.models,
      categories: state.cityContent?.searchRoute?.categoriesMap || null,
      language: state.contentLanguage,
      cityCode,
      closeModal: (query: string) => {
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
    },
    refreshProps
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>) => ({ dispatch })

const ThemedTranslatedSearch = withTheme<$Diff<SearchModalPropsType, {| t: TFunction |}>>(
  withTranslation<SearchModalPropsType>('search')(SearchModal)
)

const SearchModalContainer = (props: InnerPropsType) => {
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

const refresh = (refreshProps: OwnPropsType) => {
  const { navigation } = refreshProps
  navigation.navigate({ name: SEARCH_ROUTE })
}

export default connect<PropsType, OwnPropsType, _, _, _, _>(
  mapStateToProps,
  mapDispatchToProps
)(withPayloadProvider<InnerPropsType, OwnPropsType, SearchRouteType>(refresh, () => {}, true)(SearchModalContainer))
