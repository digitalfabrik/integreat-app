import React, { ReactElement, useEffect, useState } from 'react'

import { Rating } from 'shared'
import { createFeedbackEndpoint, FeedbackRouteType } from 'shared/api'

import { cmsApiBaseUrl } from '../constants/urls'
import { reportError } from '../utils/sentry'
import Feedback from './Feedback'

type FeedbackContainerProps = {
  cityCode: string
  language: string
  routeType: FeedbackRouteType
  query?: string
  noResults?: boolean
  slug?: string
  onSubmit?: () => void
  initialRating: Rating | null
}

export type SendingStatusType = 'idle' | 'sending' | 'failed' | 'successful'

export const FeedbackContainer = ({
  query,
  noResults,
  language,
  routeType,
  cityCode,
  slug,
  onSubmit,
  initialRating,
}: FeedbackContainerProps): ReactElement => {
  const [rating, setRating] = useState<Rating | null>(initialRating)
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
        isPositiveRating: !noResults && rating === 'positive',
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
      language={language}
      onCommentChanged={setComment}
      onContactMailChanged={setContactMail}
      onSubmit={handleSubmit}
      sendingStatus={sendingStatus}
      rating={rating}
      comment={comment}
      setRating={setRating}
      contactMail={contactMail}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    />
  )
}

export default FeedbackContainer
