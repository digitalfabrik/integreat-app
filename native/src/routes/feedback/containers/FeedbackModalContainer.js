// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import { type Dispatch } from 'redux'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import withTheme from '../../../modules/theme/hocs/withTheme'
import FeedbackModal, { type PropsType as FeedbackModalPropsType } from '../components/FeedbackModal'
import type {
  CategoriesRouteType,
  DisclaimerRouteType,
  EventsRouteType,
  FeedbackParamsType,
  FeedbackType,
  OffersRouteType,
  PoisRouteType
} from 'api-client'
import {
  CATEGORIES_FEEDBACK_TYPE,
  CATEGORIES_ROUTE,
  CityModel,
  CONTENT_FEEDBACK_CATEGORY,
  createFeedbackEndpoint,
  DISCLAIMER_ROUTE,
  EVENTS_FEEDBACK_TYPE,
  EVENTS_ROUTE,
  OFFER_FEEDBACK_TYPE,
  OfferModel,
  OFFERS_FEEDBACK_TYPE,
  OFFERS_ROUTE,
  PAGE_FEEDBACK_TYPE,
  POIS_ROUTE
} from 'api-client'
import determineApiUrl from '../../../modules/endpoint/determineApiUrl'
import type { StatusPropsType } from '../../../modules/endpoint/hocs/withPayloadProvider'
import withPayloadProvider from '../../../modules/endpoint/hocs/withPayloadProvider'
import type { StateType } from '../../../modules/app/StateType'
import createNavigateToFeedbackModal from '../../../modules/navigation/createNavigateToFeedbackModal'
import type { StoreActionType } from '../../../modules/app/StoreActionType'
import type { NavigationPropType, RoutePropType } from '../../../modules/app/constants/NavigationTypes'
import type { FeedbackModalRouteType } from 'api-client/src/routes'

type RouteType = CategoriesRouteType | EventsRouteType | PoisRouteType | OffersRouteType | DisclaimerRouteType

export type FeedbackInformationType = {|
  routeType: RouteType,
  isPositiveFeedback: boolean,
  language: string,
  cityCode: string,
  path?: string,
  alias?: string,
  offers?: Array<OfferModel>
|}

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
  return {
    status: 'success',
    innerProps: {
      ...ownProps,
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

export type SendingStatusType = 'idle' | 'sending' | 'failed' | 'successful'

type FeedbackModalStateType = {|
  comment: string,
  contactMail: string,
  sendingStatus: SendingStatusType
|}

type ContainerPropsType = {|
  ...InnerPropsType,
  t: TFunction
|}

class FeedbackModalContainer extends React.Component<ContainerPropsType, FeedbackModalStateType> {
  constructor(props: ContainerPropsType) {
    super(props)
    this.state = { comment: '', contactMail: '', sendingStatus: 'idle' }
  }

  getCityName = (): string => {
    const { cities, route } = this.props
    const cityCode = route.params.cityCode

    return CityModel.findCityName(cities, cityCode)
  }

  getFeedbackType = (): FeedbackType => {
    const { route } = this.props
    const { routeType, path, alias } = route.params

    switch (routeType) {
      case EVENTS_ROUTE:
        return path ? PAGE_FEEDBACK_TYPE : EVENTS_FEEDBACK_TYPE
      case OFFERS_ROUTE:
        return alias ? OFFER_FEEDBACK_TYPE : OFFERS_FEEDBACK_TYPE
      case DISCLAIMER_ROUTE:
        return PAGE_FEEDBACK_TYPE
      case POIS_ROUTE:
        // TODO IGAPP-438 Handle pois list feedback correctly instead of returning categories feedback type
        return path ? PAGE_FEEDBACK_TYPE : CATEGORIES_FEEDBACK_TYPE
      case CATEGORIES_ROUTE:
        return path ? PAGE_FEEDBACK_TYPE : CATEGORIES_FEEDBACK_TYPE
      default:
        return CATEGORIES_FEEDBACK_TYPE
    }
  }

  getFeedbackData = (comment: string): FeedbackParamsType => {
    const { route } = this.props
    const { path, alias, language, isPositiveFeedback } = route.params
    const feedbackType = this.getFeedbackType()
    const city = this.getCityName().toLocaleLowerCase(language)

    return {
      feedbackType,
      feedbackCategory: CONTENT_FEEDBACK_CATEGORY,
      isPositiveRating: isPositiveFeedback,
      permalink: path,
      city,
      language,
      comment,
      alias
    }
  }

  onFeedbackCommentChanged = (comment: string) => this.setState({ comment })

  onFeedbackContactMailChanged = (contactMail: string) => this.setState({ contactMail })

  handleSubmit = async () => {
    const { comment, contactMail } = this.state
    const feedbackData = this.getFeedbackData(`${comment}    Kontaktadresse: ${contactMail || 'Keine Angabe'}`)
    this.setState({ sendingStatus: 'sending' })
    try {
      const apiUrl = await determineApiUrl()
      const feedbackEndpoint = createFeedbackEndpoint(apiUrl)
      await feedbackEndpoint.request(feedbackData)
      this.setState({ sendingStatus: 'successful' })
    } catch (e) {
      console.error(e)
      this.setState({ sendingStatus: 'failed' })
    }
  }

  render() {
    const { route, t } = this.props
    const { comment, contactMail, sendingStatus } = this.state
    const { isPositiveFeedback } = route.params

    return (
      <ThemedFeedbackModal
        comment={comment}
        contactMail={contactMail}
        sendingStatus={sendingStatus}
        onCommentChanged={this.onFeedbackCommentChanged}
        onFeedbackContactMailChanged={this.onFeedbackContactMailChanged}
        isPositiveFeedback={isPositiveFeedback}
        onSubmit={this.handleSubmit}
        t={t}
      />
    )
  }
}

const ThemedFeedbackModal = withTheme<FeedbackModalPropsType>(FeedbackModal)

const ThemedTranslatedFeedbackContainer = withTranslation<ContainerPropsType>('feedback')(FeedbackModalContainer)

export default connect<PropsType, OwnPropsType, _, _, _, _>(
  mapStateToProps,
  mapDispatchToProps
)(withPayloadProvider<InnerPropsType, OwnPropsType, FeedbackModalRouteType>(refresh)(ThemedTranslatedFeedbackContainer))
