import React, { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { SEND_FEEDBACK_SIGNAL_NAME } from 'shared'
import { createFeedbackEndpoint, FeedbackRouteType } from 'shared/api'

import { determineApiUrl } from '../utils/helpers'
import sendTrackingSignal from '../utils/sendTrackingSignal'
import { reportError } from '../utils/sentry'
import Feedback from './Feedback'

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.backgroundColor};
`

export type SendingStatusType = 'idle' | 'sending' | 'failed' | 'successful'

export type FeedbackContainerProps = {
  routeType: FeedbackRouteType
  language: string
  cityCode: string
  query?: string
  slug?: string
  noResults: boolean
}

const FeedbackContainer = ({
  query,
  language,
  routeType,
  cityCode,
  slug,
  noResults,
}: FeedbackContainerProps): ReactElement => {
  const [comment, setComment] = useState<string>('')
  const [contactMail, setContactMail] = useState<string>('')
  const [isPositiveRating, setIsPositiveRating] = useState<boolean | null>(null)
  const [sendingStatus, setSendingStatus] = useState<SendingStatusType>('idle')
  const [searchTerm, setSearchTerm] = useState<string | undefined>(query)

  useEffect(() => {
    setSearchTerm(query)
    if (noResults === true) {
      setIsPositiveRating(false)
    }
  }, [query, noResults])

  const handleSubmit = () => {
    setSendingStatus('sending')

    const request = async () => {
      const feedbackEndpoint = createFeedbackEndpoint(await determineApiUrl())
      await feedbackEndpoint.request({
        routeType,
        city: cityCode,
        language,
        comment,
        contactMail,
        query,
        slug,
        searchTerm,
        isPositiveRating,
      })
      setSendingStatus('successful')
    }

    sendTrackingSignal({
      signal: {
        name: SEND_FEEDBACK_SIGNAL_NAME,
        feedback: {
          positive: isPositiveRating,
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
    <Container>
      <Feedback
        comment={comment}
        contactMail={contactMail}
        sendingStatus={sendingStatus}
        onCommentChanged={setComment}
        onFeedbackContactMailChanged={setContactMail}
        isPositiveFeedback={isPositiveRating}
        setIsPositiveFeedback={setIsPositiveRating}
        onSubmit={handleSubmit}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </Container>
  )
}

export default FeedbackContainer
