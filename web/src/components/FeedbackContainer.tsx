import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import type { FeedbackType } from 'api-client'
import {
  CATEGORIES_FEEDBACK_TYPE,
  CATEGORIES_ROUTE,
  CONTENT_FEEDBACK_CATEGORY,
  createFeedbackEndpoint,
  DISCLAIMER_ROUTE,
  EVENTS_FEEDBACK_TYPE,
  EVENTS_ROUTE,
  FeedbackParamsType,
  OFFER_FEEDBACK_TYPE,
  OFFERS_FEEDBACK_TYPE,
  OFFERS_ROUTE,
  PAGE_FEEDBACK_TYPE,
  POIS_ROUTE,
  SEARCH_FEEDBACK_TYPE,
  SEARCH_ROUTE
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

type PropsType = {
  cityCode: string
  language: string
  routeType: RouteType
  isPositiveFeedback: boolean
  isSearchFeedback: boolean
  closeModal?: () => void
  alias?: string
  path?: string
  query?: string
}

export enum SendingState {
  IDLE,
  SUCCESS,
  ERROR,
  SENDING
}

export const FeedbackContainer = (props: PropsType): ReactElement => {
  const [comment, setComment] = useState<string>('')
  const [contactMail, setContactMail] = useState<string>('')
  const [sendingStatus, setSendingStatus] = useState<SendingState>(SendingState.IDLE)
  const { path, alias, query, language, isPositiveFeedback, isSearchFeedback, routeType, cityCode, closeModal } = props
  const { t } = useTranslation('feedback')

  const getFeedbackType = (): FeedbackType => {
    switch (routeType) {
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

      case SEARCH_ROUTE:
        return SEARCH_FEEDBACK_TYPE

      default:
        return CATEGORIES_FEEDBACK_TYPE
    }
  }

  const getFeedbackData = (comment: string, contactMail: string): FeedbackParamsType => {
    const feedbackType = getFeedbackType()
    const commentWithMail = `${comment}    Kontaktadresse: ${contactMail || 'Keine Angabe'}`
    return {
      feedbackType,
      feedbackCategory: CONTENT_FEEDBACK_CATEGORY,
      isPositiveRating: isPositiveFeedback,
      permalink: path,
      city: cityCode,
      language,
      comment: commentWithMail,
      alias,
      query
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
          appName: buildConfig().appName
        })}
      </Text>
      {!!closeModal && !isSearchFeedback && <TextButton onClick={closeModal} text={t('close')} />}
    </IconTextContainer>
  )
}

export default FeedbackContainer
