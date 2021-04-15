// @flow

import { connect } from 'react-redux'
import { type Dispatch } from 'redux'
import { withTranslation } from 'react-i18next'

import type { StatusPropsType } from '../../../modules/endpoint/hocs/withPayloadProvider'
import withPayloadProvider from '../../../modules/endpoint/hocs/withPayloadProvider'
import type { FeedbackModalRouteType } from 'api-client'
import { CityModel } from 'api-client'
import type { NavigationPropType, RoutePropType } from '../../../modules/app/constants/NavigationTypes'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import type { StateType } from '../../../modules/app/StateType'
import createNavigateToFeedbackModal from '../../../modules/navigation/createNavigateToFeedbackModal'
import FeedbackContainer, {
  type PropsType as FeedbackContainerPropsType
} from '../../../modules/feedback/FeedbackContainer'

type OwnPropsType = {|
  route: RoutePropType<FeedbackModalRouteType>,
  navigation: NavigationPropType<FeedbackModalRouteType>
|}
type DispatchPropsType = {| dispatch: Dispatch<StoreActionType> |}

type InnerPropsType = {|
  ...OwnPropsType,
  ...DispatchPropsType,
  cities: $ReadOnlyArray<CityModel>
|}

type StatePropsType = StatusPropsType<InnerPropsType, OwnPropsType>
type PropsType = {| ...OwnPropsType, ...StatePropsType, ...DispatchPropsType |}

const mapStateToProps = (state: StateType, ownProps: OwnPropsType): StatePropsType => {
  const refreshProps = ownProps
  if (state.cities.status === 'error') {
    return { status: 'error', message: state.cities.message, code: state.cities.code, refreshProps }
  }

  if (state.cities.status === 'loading') {
    return { status: 'loading', progress: 0 }
  }

  const feedbackOrigin = ownProps.route.params.isPositiveFeedback ? 'positive' : 'negative'
  return {
    status: 'success',
    innerProps: {
      ...ownProps.route.params,
      feedbackOrigin: feedbackOrigin,
      cities: state.cities.models
    },
    refreshProps
  }
}

const mapDispatchToProps = (dispatch: Dispatch<StoreActionType>): DispatchPropsType => ({ dispatch })

const refresh = (refreshProps: OwnPropsType) => {
  const { navigation } = refreshProps
  const navigateToFeedback = createNavigateToFeedbackModal(navigation)
  navigateToFeedback(refreshProps.route.params)
}

const TranslatedFeedbackContainer = withTranslation<FeedbackContainerPropsType>('feedback')(FeedbackContainer)

export default connect<PropsType, OwnPropsType, _, _, _, _>(
  mapStateToProps,
  mapDispatchToProps
)(withPayloadProvider<InnerPropsType, OwnPropsType, FeedbackModalRouteType>(refresh)(TranslatedFeedbackContainer))
