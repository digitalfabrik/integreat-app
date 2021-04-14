// @flow

import * as React from 'react'
import type { TFunction } from 'react-i18next'
import withTheme from '../../../modules/theme/hocs/withTheme'
import Feedback, { type PropsType as FeedbackPropsType } from '../components/Feedback'
import type {
  CategoriesRouteType, DisclaimerRouteType,
  EventsRouteType,
  FeedbackParamsType,
  FeedbackType,
  OffersRouteType,
  PoisRouteType, SearchRouteType
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

export type SendingStatusType = 'idle' | 'sending' | 'failed' | 'successful'

type StateType = {|
  comment: string,
  contactMail: string,
  sendingStatus: SendingStatusType
|}

export type PropsType = {|
  t: TFunction,
  routeType: RouteType,
  feedbackOrigin: string,
  language: string,
  cityCode: string,
  cities: $ReadOnlyArray<CityModel>,
  path?: string,
  alias?: string,
  offers?: Array<OfferModel>
|}

export default class FeedbackContainer extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props)
    this.state = { comment: '', contactMail: '', sendingStatus: 'idle' }
    console.log(props.feedbackOrigin)
  }

  getCityName = (): string => {
    const { cities, cityCode } = this.props

    return CityModel.findCityName(cities, cityCode)
  }

  getFeedbackType = (): FeedbackType => {
    const { routeType, path, alias } = this.props

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
    const { path, alias, language, feedbackOrigin } = this.props
    const feedbackType = this.getFeedbackType()
    const city = this.getCityName().toLocaleLowerCase(language)

    return {
      feedbackType,
      feedbackCategory: CONTENT_FEEDBACK_CATEGORY,
      isPositiveRating: feedbackOrigin === 'positive',
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
    const { feedbackOrigin, t } = this.props
    const { comment, contactMail, sendingStatus } = this.state

    return (
      <ThemedFeedbackModal
        comment={comment}
        contactMail={contactMail}
        sendingStatus={sendingStatus}
        onCommentChanged={this.onFeedbackCommentChanged}
        onFeedbackContactMailChanged={this.onFeedbackContactMailChanged}
        feedbackOrigin={feedbackOrigin}
        onSubmit={this.handleSubmit}
        t={t}
      />
    )
  }
}

const ThemedFeedbackModal = withTheme<FeedbackPropsType>(Feedback)
