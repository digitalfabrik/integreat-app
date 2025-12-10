import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { SEND_FEEDBACK_SIGNAL_NAME } from 'shared'
import { createFeedbackEndpoint, FeedbackRouteType } from 'shared/api'
import { config } from 'translations'

import buildConfig from '../constants/buildConfig'
import { determineApiUrl } from '../utils/helpers'
import sendTrackingSignal from '../utils/sendTrackingSignal'
import { reportError } from '../utils/sentry'
import Feedback from './Feedback'
import Text from './base/Text'
import TextButton from './base/TextButton'

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
  padding: 8px 20px;
  gap: 8px;
`

const Title = styled(Text)`
  font-weight: 600;
  color: ${props => props.theme.colors.onSurface};
`

const StyledText = styled(Text)`
  color: ${props => props.theme.colors.onSurface};
`

const Hint = styled(Title)`
  margin-top: 8px;
  text-align: center;
  color: ${props => props.theme.colors.onSurface};
`

export type SendingStatusType = 'idle' | 'sending' | 'failed' | 'successful'

export type FeedbackContainerProps = {
  routeType: FeedbackRouteType
  language: string
  cityCode: string
  query?: string
  slug?: string
  noResults?: boolean
}

const FeedbackContainer = ({
  query,
  language,
  routeType,
  cityCode,
  slug,
  noResults = false,
}: FeedbackContainerProps): ReactElement => {
  const [comment, setComment] = useState<string>('')
  const [contactMail, setContactMail] = useState<string>('')
  const [isPositiveRating, setIsPositiveRating] = useState<boolean | null>(noResults ? false : null)
  const [sendingStatus, setSendingStatus] = useState<SendingStatusType>('idle')
  const [searchTerm, setSearchTerm] = useState<string | undefined>(query)
  const [showFeedback, setShowFeedback] = useState<boolean>(query === undefined)
  const { t } = useTranslation('feedback')

  useEffect(() => {
    setSearchTerm(query)
  }, [query])

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

  if (showFeedback) {
    return (
      <Container>
        <Feedback
          language={language}
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

  const fallbackLanguage = config.sourceLanguage

  return (
    <Container>
      <>
        <Title>
          {language === fallbackLanguage ? t('noResultsInUserLanguage') : t('noResultsInUserAndSourceLanguage')}
        </Title>
        <StyledText>{t('checkQuery', { appName: buildConfig().appName })}</StyledText>
        <Hint>{t('informationMissing')}</Hint>
        <TextButton text={t('giveFeedback')} onPress={() => setShowFeedback(true)} />
      </>
    </Container>
  )
}

export default FeedbackContainer
