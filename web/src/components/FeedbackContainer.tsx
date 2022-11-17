import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { ReactElement, useState } from 'react'
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

import buildConfig from '../constants/buildConfig'
import { faSmile } from '../constants/icons'
import { cmsApiBaseUrl } from '../constants/urls'
import { RouteType } from '../routes'
import { reportError } from '../utils/sentry'
import Feedback from './Feedback'
import TextButton from './TextButton'

const IconTextContainer = styled.div`
  margin-top: 30px;
  width: 340px;
  padding: 0 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const Text = styled.div`
  padding: 10px;
  text-align: center;
`

type FeedbackContainerProps = {
  cityCode: string
  language: string
  routeType: RouteType
  isPositiveFeedback: boolean
  isSearchFeedback: boolean
  closeModal?: () => void
  query?: string
  slug?: string
}

export enum SendingState {
  IDLE,
  SUCCESS,
  ERROR,
  SENDING,
}

export const FeedbackContainer = (props: FeedbackContainerProps): ReactElement => {
  const [comment, setComment] = useState<string>('')
  const [contactMail, setContactMail] = useState<string>('')
  const [sendingStatus, setSendingStatus] = useState<SendingState>(SendingState.IDLE)
  const { query, language, isPositiveFeedback, isSearchFeedback, routeType, cityCode, slug, closeModal } = props
  const { t } = useTranslation('feedback')

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
      query,
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
        contactMail={contactMail}
      />
    )
  }
  return (
    <IconTextContainer>
      <FontAwesomeIcon icon={faSmile} size='4x' />
      <Text>
        {t('thanksMessage', {
          appName: buildConfig().appName,
        })}
      </Text>
      {!!closeModal && !isSearchFeedback && <TextButton onClick={closeModal} text={t('close')} />}
    </IconTextContainer>
  )
}

export default FeedbackContainer
