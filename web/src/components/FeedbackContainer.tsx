import React, { ReactElement, useState } from 'react'
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
import Feedback, { Description } from './Feedback'
import { cmsApiBaseUrl } from '../constants/urls'
import { RouteType } from '../routes'
import buildConfig from '../constants/buildConfig'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const CloseButton = styled.button`
  background-color: ${props => props.theme.colors.backgroundColor};
  border: none;

  & * {
    font-size: 0.8em;
    vertical-align: baseline;
  }
`

type PropsType = {
  alias?: string
  path?: string
  query?: string
  cityCode: string
  language: string
  routeType: RouteType
  isPositiveFeedback: boolean
  isSearchFeedback: boolean
  closeModal?: () => void
}

export type SendingStatusType = 'IDLE' | 'SUCCESS' | 'ERROR' | 'SENDING'

export const FeedbackContainer = (props: PropsType): ReactElement => {
  const [comment, setComment] = useState<string>('')
  const [contactMail, setContactMail] = useState<string>('')
  const [sendingStatus, setSendingStatus] = useState<SendingStatusType>('IDLE')
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

  const onFeedbackCommentChanged = (comment: string) => setComment(comment)

  const onFeedbackContactMailChanged = (contactMail: string) => setContactMail(contactMail)

  const handleSubmit = () => {
    const feedbackData = getFeedbackData(comment, contactMail)
    setSendingStatus('SENDING')

    const request = async () => {
      const apiUrl = cmsApiBaseUrl
      const feedbackEndpoint = createFeedbackEndpoint(apiUrl)
      await feedbackEndpoint.request(feedbackData)
      setSendingStatus('SUCCESS')
    }

    request().catch(err => {
      console.log(err)
      setSendingStatus('ERROR')
    })
  }

  if (['IDLE', 'ERROR'].includes(sendingStatus)) {
    return (
      <>
        <Feedback
          onCommentChanged={onFeedbackCommentChanged}
          onContactMailChanged={onFeedbackContactMailChanged}
          onSubmit={handleSubmit}
          sendingStatus={sendingStatus}
          isPositiveFeedback={isPositiveFeedback}
          isSearchFeedback={isSearchFeedback}
          comment={comment}
          contactMail={contactMail}
        />
      </>
    )
  } else {
    return (
      <>
        <Description>
          {t('thanksMessage', {
            appName: buildConfig().appName
          })}
        </Description>
        {!!closeModal && <CloseButton onClick={closeModal}>Close</CloseButton>}
      </>
    )
  }

}

export default FeedbackContainer
