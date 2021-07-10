import React, { ReactElement, useState } from 'react'
import { createFeedbackEndpoint, ErrorCode, fromError, SEARCH_FEEDBACK_TYPE } from 'api-client'
import { Description, StyledFeedbackBox } from './FeedbackBox'
import FeedbackComment from './FeedbackComment'
import { cmsApiBaseUrl } from '../constants/urls'
import TextButton from './TextButton'
import buildConfig from '../constants/buildConfig'
import { useTranslation } from 'react-i18next'
import { reportError } from '../services/sentry'

type PropsType = {
  query?: string
  cityCode: string
  languageCode: string
}

const NothingFoundFeedbackBox = ({ query, cityCode, languageCode }: PropsType): ReactElement => {
  const [comment, setComment] = useState<string>('')
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false)
  const { t } = useTranslation('feedback')

  const handleSubmit = async (): Promise<void> => {
    try {
      await createFeedbackEndpoint(cmsApiBaseUrl).request({
        feedbackType: SEARCH_FEEDBACK_TYPE,
        isPositiveRating: false,
        comment,
        city: cityCode,
        language: languageCode,
        query
      })
      setFeedbackSent(true)
    } catch (e) {
      console.error(e)
      if (fromError(e) !== ErrorCode.NetworkConnectionFailed) {
        reportError(e)
      }
    }
  }

  return (
    <StyledFeedbackBox>
      {feedbackSent ? (
        <Description>{t('thanksMessage', { appName: buildConfig().appName })}</Description>
      ) : (
        <>
          <FeedbackComment comment={comment} commentMessage={t('wantedInformation')} onCommentChanged={setComment} />
          <TextButton onClick={handleSubmit} text={t('send')} />
        </>
      )}
    </StyledFeedbackBox>
  )
}

export default NothingFoundFeedbackBox
