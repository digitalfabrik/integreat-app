import React, { ReactElement, useState } from 'react'

import {
  CategoriesRouteType,
  CATEGORIES_ROUTE,
  CONTENT_FEEDBACK_CATEGORY,
  createFeedbackEndpoint,
  DisclaimerRouteType,
  DISCLAIMER_ROUTE,
  EventsRouteType,
  EVENTS_ROUTE,
  FeedbackParamsType,
  FeedbackType,
  OffersRouteType,
  OFFERS_ROUTE,
  PoisRouteType,
  POIS_ROUTE,
  SearchRouteType,
  SEARCH_ROUTE,
  SEND_FEEDBACK_SIGNAL_NAME,
} from 'api-client'

import { determineApiUrl } from '../utils/helpers'
import sendTrackingSignal from '../utils/sendTrackingSignal'
import { reportError } from '../utils/sentry'
import Feedback from './Feedback'

export type SendingStatusType = 'idle' | 'sending' | 'failed' | 'successful'

export type RouteType =
  | CategoriesRouteType
  | EventsRouteType
  | PoisRouteType
  | OffersRouteType
  | DisclaimerRouteType
  | SearchRouteType
export type FeedbackInformationType = {
  routeType: RouteType
  language: string
  cityCode: string
  slug?: string
}
export type FeedbackContainerProps = {
  routeType: RouteType
  isSearchFeedback: boolean
  language: string
  cityCode: string
  query?: string
  slug?: string
}

const FeedbackContainer = (props: FeedbackContainerProps): ReactElement => {
  const [comment, setComment] = useState<string>('')
  const [contactMail, setContactMail] = useState<string>('')
  const [isPositiveFeedback, setIsPositiveFeedback] = useState<boolean | null>(null)
  const [sendingStatus, setSendingStatus] = useState<SendingStatusType>('idle')
  const { query, language, isSearchFeedback, routeType, cityCode, slug } = props

  const getFeedbackType = (): FeedbackType => {
    switch (routeType) {
      case EVENTS_ROUTE:
        return slug ? FeedbackType.event : FeedbackType.events

      case OFFERS_ROUTE:
        return slug ? FeedbackType.offer : FeedbackType.offers

      case DISCLAIMER_ROUTE:
        return FeedbackType.imprint

      case POIS_ROUTE:
        return slug ? FeedbackType.poi : FeedbackType.map

      case CATEGORIES_ROUTE:
        return slug ? FeedbackType.page : FeedbackType.categories

      case SEARCH_ROUTE:
        return FeedbackType.search

      default:
        return FeedbackType.categories
    }
  }

  const getFeedbackData = (comment: string, contactMail: string): FeedbackParamsType => {
    const feedbackType = getFeedbackType()
    const commentWithMail = `${comment}    Kontaktadresse: ${contactMail || 'Keine Angabe'}`
    return {
      feedbackType,
      feedbackCategory: CONTENT_FEEDBACK_CATEGORY,
      isPositiveRating: isPositiveFeedback,
      city: cityCode,
      language,
      comment: commentWithMail,
      query,
      slug,
    }
  }

  const onFeedbackCommentChanged = (comment: string) => setComment(comment)

  const onFeedbackContactMailChanged = (contactMail: string) => setContactMail(contactMail)

  const handleSubmit = () => {
    const feedbackData = getFeedbackData(comment, contactMail)

    setSendingStatus('sending')

    const request = async () => {
      const apiUrl = await determineApiUrl()
      const feedbackEndpoint = createFeedbackEndpoint(apiUrl)
      await feedbackEndpoint.request(feedbackData)
      setSendingStatus('successful')
    }

    sendTrackingSignal({
      signal: {
        name: SEND_FEEDBACK_SIGNAL_NAME,
        feedback: {
          positive: feedbackData.isPositiveRating,
          numCharacters: comment.length,
          contactMail: contactMail.length > 0,
        },
      },
    })
    request().catch(err => {
      reportError(err)
      setSendingStatus('failed')
    })
  }

  return (
    <Feedback
      comment={comment}
      contactMail={contactMail}
      sendingStatus={sendingStatus}
      onCommentChanged={onFeedbackCommentChanged}
      onFeedbackContactMailChanged={onFeedbackContactMailChanged}
      isSearchFeedback={isSearchFeedback}
      isPositiveFeedback={isPositiveFeedback}
      setIsPositiveFeedback={setIsPositiveFeedback}
      onSubmit={handleSubmit}
    />
  )
}

export default FeedbackContainer
