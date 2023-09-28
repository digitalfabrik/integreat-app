import React, { ReactElement, useEffect, useState } from 'react'

import {
  CATEGORIES_ROUTE,
  CategoriesRouteType,
  CONTENT_FEEDBACK_CATEGORY,
  createFeedbackEndpoint,
  DISCLAIMER_ROUTE,
  DisclaimerRouteType,
  EVENTS_ROUTE,
  EventsRouteType,
  FeedbackParamsType,
  FeedbackType,
  OFFERS_ROUTE,
  OffersRouteType,
  POIS_ROUTE,
  PoisRouteType,
  SEARCH_ROUTE,
  SearchRouteType,
  SEND_FEEDBACK_SIGNAL_NAME,
  SPRUNGBRETT_OFFER_ROUTE,
  SprungbrettOfferRouteType,
} from 'api-client'

import { determineApiUrl } from '../utils/helpers'
import sendTrackingSignal from '../utils/sendTrackingSignal'
import { reportError } from '../utils/sentry'
import Feedback from './Feedback'
import HorizontalLine from './HorizontalLine'

export type SendingStatusType = 'idle' | 'sending' | 'failed' | 'successful'

export type RouteType =
  | CategoriesRouteType
  | EventsRouteType
  | PoisRouteType
  | OffersRouteType
  | DisclaimerRouteType
  | SearchRouteType
  | SprungbrettOfferRouteType
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
  hasDivider?: boolean
}

const FeedbackContainer = ({
  query,
  language,
  isSearchFeedback,
  routeType,
  cityCode,
  slug,
  hasDivider,
}: FeedbackContainerProps): ReactElement => {
  const [comment, setComment] = useState<string>('')
  const [contactMail, setContactMail] = useState<string>('')
  const [isPositiveFeedback, setIsPositiveFeedback] = useState<boolean | null>(null)
  const [sendingStatus, setSendingStatus] = useState<SendingStatusType>('idle')
  const [searchTerm, setSearchTerm] = useState<string | undefined>(query)

  useEffect(() => {
    setSearchTerm(query)
  }, [query])

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

      case SPRUNGBRETT_OFFER_ROUTE:
        return FeedbackType.offer

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
      query: searchTerm?.trim().length === 0 ? query : searchTerm,
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
    <>
      {hasDivider && <HorizontalLine />}
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
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </>
  )
}

export default FeedbackContainer
