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
  isChatEnabled?: boolean
  onClearSearch?: () => void
  noResults?: boolean
}

export const FeedbackContainer = ({
  query,
  language,
  routeType,
  regionCode,
  slug,
  rating: initialRating,
  isChatEnabled = false,
  onClearSearch,
  noResults,
}: FeedbackContainerProps): ReactElement => {
  const [comment, setComment] = useState<string>('')
  const [contactMail, setContactMail] = useState<string>('')
  const [rating, setRating] = useState<Rating | null>(initialRating ?? null)
  const [sendingStatus, setSendingStatus] = useState<SendingStatusType>('idle')
  const [searchTerm, setSearchTerm] = useState<string | undefined>(query)
  const [alertStatusOpen, setAlertStatusOpen] = useState(false)

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
      setAlertStatusOpen(true)
    }

    request().catch(err => {
      captureError(err)
      setSendingStatus('failed')
      setAlertStatusOpen(true)
    })
  }

  if (noResults) {
    return (
      <Container>
        <SearchFeedback
          routeType={routeType}
          language={language}
          regionCode={regionCode}
          sendingStatus={sendingStatus}
          alertStatusOpen={alertStatusOpen}
          handleSubmit={handleSubmit}
          slug={slug}
          isChatEnabled={isChatEnabled}
          onClearSearch={onClearSearch}
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
