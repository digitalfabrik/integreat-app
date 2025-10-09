import React, { ReactElement, useEffect, useState } from 'react'

import { Rating } from 'shared'
import { createFeedbackEndpoint, FeedbackRouteType } from 'shared/api'

import { cmsApiBaseUrl } from '../constants/urls'
import useCityContentParams from '../hooks/useCityContentParams'
import { reportError } from '../utils/sentry'
import Feedback from './Feedback'

type FeedbackContainerProps = {
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
  slug,
  onSubmit,
  initialRating,
}: FeedbackContainerProps): ReactElement => {
  const [rating, setRating] = useState<Rating | null>(initialRating)
  const [comment, setComment] = useState<string>('')
  const [contactMail, setContactMail] = useState<string>('')
  const [sendingStatus, setSendingStatus] = useState<SendingStatusType>('idle')
  const [searchTerm, setSearchTerm] = useState<string | undefined>(query)
  const { route, cityCode, languageCode } = useCityContentParams()

  useEffect(() => {
    setSearchTerm(query)
  }, [query])

  const handleSubmit = () => {
    setSendingStatus('sending')

    const request = async () => {
      const feedbackEndpoint = createFeedbackEndpoint(cmsApiBaseUrl)
      await feedbackEndpoint.request({
        routeType: route as FeedbackRouteType,
        city: cityCode,
        language: languageCode,
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
      language={languageCode}
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
