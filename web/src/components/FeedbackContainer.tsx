import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import {
  CATEGORIES_ROUTE,
  CONTENT_FEEDBACK_CATEGORY,
  createFeedbackEndpoint,
  DISCLAIMER_ROUTE,
  EVENTS_ROUTE,
  FeedbackParamsType,
  FeedbackType,
  OFFERS_ROUTE,
  POIS_ROUTE,
  SEARCH_ROUTE,
} from 'api-client'

import { cmsApiBaseUrl } from '../constants/urls'
import { RouteType } from '../routes'
import { reportError } from '../utils/sentry'
import Feedback, { Container } from './Feedback'
import TextButton from './base/TextButton'

const Text = styled.div`
  padding: 10px;
  text-align: center;
`

type FeedbackContainerProps = {
  cityCode: string
  language: string
  routeType: RouteType
  isSearchFeedback: boolean
  closeModal?: () => void
  query?: string
  slug?: string
  onSubmit?: () => void
}

export enum SendingState {
  IDLE,
  SUCCESS,
  ERROR,
  SENDING,
}

export const FeedbackContainer = ({
  query,
  language,
  isSearchFeedback,
  routeType,
  cityCode,
  slug,
  closeModal,
  onSubmit,
}: FeedbackContainerProps): ReactElement => {
  const [isPositiveFeedback, setIsPositiveFeedback] = useState<boolean | null>(null)
  const [comment, setComment] = useState<string>('')
  const [contactMail, setContactMail] = useState<string>('')
  const [sendingStatus, setSendingStatus] = useState<SendingState>(SendingState.IDLE)
  const [searchTerm, setSearchTerm] = useState<string | undefined>(query)

  const { t } = useTranslation('feedback')

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
      query: query === searchTerm ? query : `${searchTerm} (actual query: ${query})`,
      slug,
    }
  }

  const handleSubmit = () => {
    const feedbackData = getFeedbackData(comment, contactMail)
    setSendingStatus(SendingState.SENDING)

    const request = async () => {
      const feedbackEndpoint = createFeedbackEndpoint(cmsApiBaseUrl)
      await feedbackEndpoint.request(feedbackData)
      setSendingStatus(SendingState.SUCCESS)
      if (onSubmit) {
        onSubmit()
      }
    }

    request().catch(err => {
      reportError(err)
      setSendingStatus(SendingState.ERROR)
    })
  }

  if (sendingStatus !== SendingState.SUCCESS) {
    return (
      <Feedback
        onCommentChanged={setComment}
        onContactMailChanged={setContactMail}
        onSubmit={handleSubmit}
        sendingStatus={sendingStatus}
        isPositiveFeedback={isPositiveFeedback}
        isSearchFeedback={isSearchFeedback}
        comment={comment}
        onFeedbackChanged={setIsPositiveFeedback}
        contactMail={contactMail}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    )
  }
  return (
    <Container>
      <Text>{t('thanksMessage')}</Text>
      {!!closeModal && !isSearchFeedback && <TextButton onClick={closeModal} text={t('common:close')} />}
    </Container>
  )
}

export default FeedbackContainer
