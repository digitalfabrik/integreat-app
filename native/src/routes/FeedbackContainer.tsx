import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { FeedbackRouteType, Rating, SendingStatusType } from 'shared'
import { createFeedbackEndpoint, FeedbackType } from 'shared/api'

import Feedback from '../components/Feedback'
import SearchFeedback from '../components/SearchFeedback'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import useSetRouteTitle from '../hooks/useSetRouteTitle'
import { determineApiUrl } from '../utils/helpers'
import { captureError } from '../utils/sentry'

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
  padding: 8px 20px;
  gap: 8px;
`

export type FeedbackContainerProps = {
  routeType: FeedbackType
  language: string
  regionCode: string
  query?: string
  slug?: string
  rating?: Rating
  hasResults?: boolean
  isChatEnabled?: boolean
}

export const FeedbackContainer = ({
  query,
  language,
  routeType,
  regionCode,
  slug,
  rating: initialRating,
  hasResults,
  isChatEnabled = false,
}: FeedbackContainerProps): ReactElement => {
  const [comment, setComment] = useState<string>('')
  const [contactMail, setContactMail] = useState<string>('')
  const [rating, setRating] = useState<Rating | null>(initialRating ?? null)
  const [sendingStatus, setSendingStatus] = useState<SendingStatusType>('idle')
  const [searchTerm, setSearchTerm] = useState<string | undefined>(query)

  useEffect(() => {
    setSearchTerm(query)
  }, [query])

  const handleSubmit = () => {
    setSendingStatus('sending')

    const request = async () => {
      const feedbackEndpoint = createFeedbackEndpoint(await determineApiUrl())
      await feedbackEndpoint.request({
        routeType,
        region: regionCode,
        language,
        comment,
        contactMail,
        query,
        slug,
        searchTerm,
        rating,
      })
      setSendingStatus('successful')
    }

    request().catch(err => {
      captureError(err)
      setSendingStatus('failed')
    })
  }

  if (hasResults !== undefined) {
    return (
      <Container>
        <SearchFeedback
          routeType={routeType}
          language={language}
          regionCode={regionCode}
          sendingStatus={sendingStatus}
          handleSubmit={handleSubmit}
          query={query}
          slug={slug}
          hasResults={hasResults}
          isChatEnabled={isChatEnabled}
        />
      </Container>
    )
  }

  return (
    <Container>
      <Feedback
        language={language}
        comment={comment}
        contactMail={contactMail}
        sendingStatus={sendingStatus}
        onCommentChanged={setComment}
        onFeedbackContactMailChanged={setContactMail}
        rating={rating}
        setRating={setRating}
        onSubmit={handleSubmit}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </Container>
  )
}

type FeedbackRouteContainerProps = {
  route: RouteProps<FeedbackRouteType>
  navigation: NavigationProps<FeedbackRouteType>
}

const FeedbackRouteContainer = ({ route }: FeedbackRouteContainerProps): ReactElement => {
  const { t } = useTranslation()
  useSetRouteTitle(t($ => $.feedback.title))
  return <FeedbackContainer {...route.params} />
}

export default FeedbackRouteContainer
