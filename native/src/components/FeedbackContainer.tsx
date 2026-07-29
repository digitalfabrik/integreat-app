import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'react-native-paper'
import styled from 'styled-components/native'

import { RATING_POSITIVE, Rating, SendingStatusType } from 'shared'
import { createFeedbackEndpoint, FeedbackRouteType } from 'shared/api'
import { config } from 'translations'

import buildConfig from '../constants/buildConfig'
import { determineApiUrl } from '../utils/helpers'
import { captureError } from '../utils/sentry'
import Feedback from './Feedback'
import Text from './base/Text'

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
  padding: 8px 20px;
  gap: 8px;
`

export type FeedbackContainerProps = {
  routeType: FeedbackRouteType
  language: string
  regionCode: string
  query?: string
  slug?: string
  rating?: Rating
}

const FeedbackContainer = ({
  query,
  language,
  routeType,
  regionCode,
  slug,
  rating,
}: FeedbackContainerProps): ReactElement => {
  const [comment, setComment] = useState<string>('')
  const [contactMail, setContactMail] = useState<string>('')
  const [feedbackRating, setFeedbackRating] = useState<boolean | null>(rating ? rating === RATING_POSITIVE : null)
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
        region: regionCode,
        language,
        comment,
        contactMail,
        query,
        slug,
        searchTerm,
        isPositiveRating: feedbackRating,
      })
      setSendingStatus('successful')
    }

    request().catch(err => {
      captureError(err)
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
          feedbackRating={feedbackRating}
          setFeedbackRating={setFeedbackRating}
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
        <Text variant='h6'>
          {language === fallbackLanguage ? t('noResultsInUserLanguage') : t('noResultsInUserAndSourceLanguage')}
        </Text>
        <Text>{t('checkQuery', { appName: buildConfig().appName })}</Text>
        <Text variant='h6' style={{ marginTop: 8, textAlign: 'center' }}>
          {t('informationMissing')}
        </Text>
        <Button mode='outlined' onPress={() => setShowFeedback(true)}>
          {t('giveFeedback')}
        </Button>
      </>
    </Container>
  )
}

export default FeedbackContainer
