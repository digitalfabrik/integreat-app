import React, { useCallback, useState } from 'react'
import type { FeedbackType } from 'api-client'
import {
  CATEGORIES_FEEDBACK_TYPE,
  createFeedbackEndpoint,
  DEFAULT_FEEDBACK_LANGUAGE,
  EVENTS_FEEDBACK_TYPE,
  INTEGREAT_INSTANCE,
  OFFER_FEEDBACK_TYPE,
  OFFERS_FEEDBACK_TYPE,
  PAGE_FEEDBACK_TYPE
} from 'api-client'
import { TFunction, withTranslation } from 'react-i18next'
import FeedbackBox from './FeedbackBox'
import { Routes, RouteParamsType } from '../routes/App'
import type { SendingStatusType } from './FeedbackModal'
import { Location } from 'history'
import { useLocation, useParams } from 'react-router-dom'
import { cmsApiBaseUrl } from '../constants/urls'

type PropsType = {
  alias?: string
  path?: string
  isPositiveRatingSelected: boolean
  closeFeedbackModal: () => void
  sendingStatus: SendingStatusType
  onSubmit: (sendingStatus: SendingStatusType) => void
  t: TFunction
}

/**
 * Renders a FeedbackBox with all possible feedback options the User can select
 */
export const FeedbackBoxContainer = ({
  alias,
  path,
  isPositiveRatingSelected,
  closeFeedbackModal,
  sendingStatus,
  onSubmit,
  t
}: PropsType) => {
  const [comment, setComment] = useState<string>('')
  const [contactMail, setContactMail] = useState<string>('')
  const { city, language } = useParams<RouteParamsType>()
  const location = useLocation()

  const getFeedbackType = (location: Location, path: string | undefined, alias: string | undefined): FeedbackType => {
    const routeType = location.state

    switch (routeType) {
      case Routes.EVENTS_ROUTE:
        return path ? PAGE_FEEDBACK_TYPE : EVENTS_FEEDBACK_TYPE

      case Routes.OFFERS_ROUTE:
        return alias ? OFFER_FEEDBACK_TYPE : OFFERS_FEEDBACK_TYPE

      case Routes.DISCLAIMER_ROUTE:
        return PAGE_FEEDBACK_TYPE

      case Routes.POIS_ROUTE:
        return path ? PAGE_FEEDBACK_TYPE : CATEGORIES_FEEDBACK_TYPE

      case Routes.CATEGORIES_ROUTE:
        return path ? PAGE_FEEDBACK_TYPE : CATEGORIES_FEEDBACK_TYPE

      default:
        return CATEGORIES_FEEDBACK_TYPE
    }
  }

  const submitFeedback = useCallback(async () => {
    const feedbackType = getFeedbackType(location, path, alias)
    const feedbackData = {
      feedbackType,
      isPositiveRating: isPositiveRatingSelected,
      comment: `${comment}    Kontaktadresse: ${contactMail || 'Keine Angabe'}`,
      permalink: path,
      city: city || INTEGREAT_INSTANCE,
      language: language || DEFAULT_FEEDBACK_LANGUAGE,
      alias
    }

    try {
      await createFeedbackEndpoint(cmsApiBaseUrl).request(feedbackData)
      onSubmit('SUCCESS')
    } catch (e) {
      console.error(e)
      onSubmit('ERROR')
    }
  }, [location, path, alias, isPositiveRatingSelected, comment, contactMail, city, language, onSubmit])

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

export default withTranslation('feedback')(FeedbackBoxContainer)
