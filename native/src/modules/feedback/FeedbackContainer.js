// @flow

import React, { useContext, useState } from 'react'
import Feedback from './Feedback'
import type {
  CategoriesRouteType,
  DisclaimerRouteType,
  EventsRouteType,
  FeedbackParamsType,
  FeedbackType,
  OffersRouteType,
  PoisRouteType,
  SearchRouteType
} from 'api-client'
import {
  CATEGORIES_FEEDBACK_TYPE,
  CATEGORIES_ROUTE,
  CONTENT_FEEDBACK_CATEGORY,
  createFeedbackEndpoint,
  DISCLAIMER_ROUTE,
  EVENTS_FEEDBACK_TYPE,
  EVENTS_ROUTE,
  OFFER_FEEDBACK_TYPE,
  OFFERS_FEEDBACK_TYPE,
  OFFERS_ROUTE,
  PAGE_FEEDBACK_TYPE,
  POIS_ROUTE,
  SEARCH_FEEDBACK_TYPE,
  SEARCH_ROUTE
} from 'api-client'
import determineApiUrl from '../endpoint/determineApiUrl'
import { ThemeContext } from 'styled-components'
import { useTranslation } from 'react-i18next'

export type SendingStatusType = 'idle' | 'sending' | 'failed' | 'successful'

type RouteType =
  | CategoriesRouteType
  | EventsRouteType
  | PoisRouteType
  | OffersRouteType
  | DisclaimerRouteType
  | SearchRouteType

export type FeedbackInformationType = {|
  routeType: RouteType,
  isPositiveFeedback: boolean,
  language: string,
  cityCode: string,
  path?: string,
  alias?: string
|}

export type PropsType = {|
  routeType: RouteType,
  isSearchFeedback: boolean,
  isPositiveFeedback: boolean,
  language: string,
  cityCode: string,
  path?: string,
  alias?: string,
  query?: string
|}

const FeedbackContainer = (props: PropsType) => {
  const [comment, setComment] = useState<string>('')
  const [contactMail, setContactMail] = useState<string>('')
  const [sendingStatus, setSendingStatus] = useState<SendingStatusType>('idle')
  const { path, alias, query, language, isPositiveFeedback, isSearchFeedback, routeType, cityCode } = props

  const theme = useContext(ThemeContext)
  const { t } = useTranslation('search')

  const getFeedbackType = (): FeedbackType => {
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
      case SEARCH_ROUTE:
        return SEARCH_FEEDBACK_TYPE
      default:
        return CATEGORIES_FEEDBACK_TYPE
    }
  }

  const getFeedbackData = (comment: string, contactMail: string): FeedbackParamsType => {
    const feedbackType = getFeedbackType()
    const commentWithMail = `${comment}    Kontaktadresse: ${contactMail || 'Keine Angabe'}`

    return {
      feedbackType,
      feedbackCategory: CONTENT_FEEDBACK_CATEGORY,
      isPositiveRating: isPositiveFeedback,
      permalink: path,
      city: cityCode,
      language,
      comment: commentWithMail,
      alias,
      query
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
    request().catch(err => {
      console.log(err)
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
      onSubmit={handleSubmit}
      theme={theme}
      t={t}
    />
  )
}

export default FeedbackContainer
