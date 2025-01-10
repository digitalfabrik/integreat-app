import React, { ReactElement, useEffect, useState } from 'react'

import { createFeedbackEndpoint, FeedbackRouteType } from 'shared/api'

import { cmsApiBaseUrl } from '../constants/urls'
import { reportError } from '../utils/sentry'
import Feedback from './Feedback'

type FeedbackContainerProps = {
  cityCode: string
  language: string
  routeType: FeedbackRouteType
  onClose?: () => void
  query?: string
  noResults?: boolean
  slug?: string
  onSubmit?: () => void
  isPositiveRating: boolean | null
  setIsPositiveRating?: (isPositiveFeedback: boolean | null) => void
}

export type SendingStatusType = 'idle' | 'sending' | 'failed' | 'successful'

export const FeedbackContainer = ({
  query,
  noResults,
  language,
  routeType,
  cityCode,
  slug,
  onClose,
  onSubmit,
  isPositiveRating,
  setIsPositiveRating,
}: FeedbackContainerProps): ReactElement => {
  const [comment, setComment] = useState<string>('')
  const [contactMail, setContactMail] = useState<string>('')
  const [sendingStatus, setSendingStatus] = useState<SendingStatusType>('idle')
  const [searchTerm, setSearchTerm] = useState<string | undefined>(query)

  useEffect(() => {
    setSearchTerm(query)
  }, [query])

  const handleSubmit = () => {
    setSendingStatus('sending')

    const request = async () => {
      const feedbackEndpoint = createFeedbackEndpoint(cmsApiBaseUrl)
      await feedbackEndpoint.request({
        routeType,
        city: cityCode,
        language,
        comment,
        contactMail,
        query,
        slug,
        searchTerm,
        isPositiveRating: noResults === true ? false : isPositiveRating,
      })

      setSendingStatus('successful')

      if (onSubmit) {
        onSubmit()
      }
    }

    request().catch(err => {
      reportError(err)
      setSendingStatus('failed')
    })
  }

  return (
    <Feedback
      onCommentChanged={setComment}
      onContactMailChanged={setContactMail}
      onSubmit={handleSubmit}
      sendingStatus={sendingStatus}
      isPositiveFeedback={isPositiveRating}
      comment={comment}
      onFeedbackChanged={setIsPositiveRating}
      contactMail={contactMail}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      closeFeedback={onClose}
      noResults={noResults}
    />
  )
}

export default FeedbackContainer
