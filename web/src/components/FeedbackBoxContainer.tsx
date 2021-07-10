import React, { ReactElement, useCallback, useState } from 'react'
import type { FeedbackType } from 'api-client'
import {
  CATEGORIES_FEEDBACK_TYPE,
  CATEGORIES_ROUTE,
  createFeedbackEndpoint,
  DEFAULT_FEEDBACK_LANGUAGE,
  DISCLAIMER_ROUTE,
  ErrorCode,
  EVENTS_FEEDBACK_TYPE,
  EVENTS_ROUTE,
  fromError,
  INTEGREAT_INSTANCE,
  OFFER_FEEDBACK_TYPE,
  OFFERS_FEEDBACK_TYPE,
  OFFERS_ROUTE,
  PAGE_FEEDBACK_TYPE,
  POIS_ROUTE
} from 'api-client'
import FeedbackBox from './FeedbackBox'
import type { SendingStatusType } from './FeedbackModal'
import { cmsApiBaseUrl } from '../constants/urls'
import { RouteType } from '../routes'
import { reportError } from '../services/sentry'

type PropsType = {
  alias?: string
  path?: string
  cityCode: string
  language: string
  route: RouteType
  isPositiveRatingSelected: boolean
  closeFeedbackModal: () => void
  sendingStatus: SendingStatusType
  onSubmit: (sendingStatus: SendingStatusType) => void
}

/**
 * Renders a FeedbackBox with all possible feedback options the User can select
 */
export const FeedbackBoxContainer = ({
  alias,
  path,
  cityCode,
  language,
  route,
  isPositiveRatingSelected,
  closeFeedbackModal,
  sendingStatus,
  onSubmit
}: PropsType): ReactElement => {
  const [comment, setComment] = useState<string>('')
  const [contactMail, setContactMail] = useState<string>('')

  const getFeedbackType = (route: RouteType, path?: string, alias?: string): FeedbackType => {
    switch (route) {
      case EVENTS_ROUTE:
        return path ? PAGE_FEEDBACK_TYPE : EVENTS_FEEDBACK_TYPE

      case OFFERS_ROUTE:
        return alias ? OFFER_FEEDBACK_TYPE : OFFERS_FEEDBACK_TYPE

      case DISCLAIMER_ROUTE:
        return PAGE_FEEDBACK_TYPE

      case POIS_ROUTE:
        return path ? PAGE_FEEDBACK_TYPE : CATEGORIES_FEEDBACK_TYPE

      case CATEGORIES_ROUTE:
        return path ? PAGE_FEEDBACK_TYPE : CATEGORIES_FEEDBACK_TYPE
      default:
        return CATEGORIES_FEEDBACK_TYPE
    }
  }

  const submitFeedback = useCallback(async () => {
    const feedbackType = getFeedbackType(route, path, alias)
    const feedbackData = {
      feedbackType,
      isPositiveRating: isPositiveRatingSelected,
      comment: `${comment}    Kontaktadresse: ${contactMail || 'Keine Angabe'}`,
      permalink: path,
      city: cityCode || INTEGREAT_INSTANCE,
      language: language || DEFAULT_FEEDBACK_LANGUAGE,
      alias
    }

    try {
      await createFeedbackEndpoint(cmsApiBaseUrl).request(feedbackData)
      onSubmit('SUCCESS')
    } catch (e) {
      console.error(e)
      if (fromError(e) !== ErrorCode.NetworkConnectionFailed) {
        reportError(e)
      }
      onSubmit('ERROR')
    }
  }, [route, path, alias, isPositiveRatingSelected, comment, contactMail, cityCode, language, onSubmit])

  return (
    <FeedbackBox
      onCommentChanged={setComment}
      onContactMailChanged={setContactMail}
      onSubmit={submitFeedback}
      sendingStatus={sendingStatus}
      closeFeedbackModal={closeFeedbackModal}
      isPositiveRatingSelected={isPositiveRatingSelected}
      comment={comment}
      contactMail={contactMail}
    />
  )
}

export default FeedbackBoxContainer
