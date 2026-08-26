import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Button } from 'react-native-paper'
import styled from 'styled-components/native'

import { DEFAULT_ROWS_NUMBER, Rating, SendingStatusType } from 'shared'

import buildConfig from '../constants/buildConfig'
import useNavigate from '../hooks/useNavigate'
import Caption from './Caption'
import FeedbackButtons from './FeedbackButtons'
import LoadingSpinner from './LoadingSpinner'
import Note from './Note'
import PrivacyCheckbox from './PrivacyCheckbox'
import InputSection from './base/InputSection'
import Text from './base/Text'

const Wrapper = styled.View`
  gap: 8px;
`

export type FeedbackProps = {
  language: string
  comment: string
  contactMail: string
  sendingStatus: SendingStatusType
  onCommentChanged: (comment: string) => void
  onFeedbackContactMailChanged: (contactMail: string) => void
  rating: Rating | null
  setRating: (rating: Rating | null) => void
  onSubmit: () => void
  searchTerm?: string
  setSearchTerm: (newTerm: string) => void
}

const Feedback = ({
  language,
  rating,
  comment,
  contactMail,
  sendingStatus,
  setRating,
  onFeedbackContactMailChanged,
  onCommentChanged,
  onSubmit,
  searchTerm,
  setSearchTerm,
}: FeedbackProps): ReactElement => {
  const { t } = useTranslation(['feedback', 'common'])
  const navigation = useNavigate().navigation

  const isSearchFeedback = searchTerm !== undefined
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false)
  const feedbackMissing = rating === null && comment.trim().length === 0 && !searchTerm
  const submitFeedbackDisabled = feedbackMissing || !privacyPolicyAccepted

  if (sendingStatus === 'sending') {
    return <LoadingSpinner />
  }

  if (sendingStatus === 'successful') {
    return (
      <Wrapper>
        <Caption title={t($ => $.feedback.thanksHeadline)} />
        <Text>{t($ => $.feedback.thanksMessage)}</Text>
        <Button onPress={navigation.goBack} mode='contained' style={{ marginTop: 16 }}>
          {t($ => $.common.close)}
        </Button>
      </Wrapper>
    )
  }

  return (
    <KeyboardAwareScrollView>
      <Wrapper>
        {isSearchFeedback ? (
          <InputSection
            title={t($ => $.feedback.searchTermDescription)}
            value={searchTerm}
            onChange={setSearchTerm}
            accessibilityRole='search'
          />
        ) : (
          <>
            <Caption title={t($ => $.feedback.headline)} />
            <FeedbackButtons rating={rating} setRating={setRating} />
          </>
        )}
        <InputSection
          title={t($ => $.feedback.commentHeadline)}
          description={t($ => $.feedback.commentDescription, { appName: buildConfig().appName })}
          value={comment}
          onChange={onCommentChanged}
          multiline
          numberOfLines={DEFAULT_ROWS_NUMBER}
          showOptional
          accessibilityRole='text'
        />
        <InputSection
          title={t($ => $.feedback.contactMailAddress)}
          value={contactMail}
          onChange={onFeedbackContactMailChanged}
          keyboardType='email-address'
          showOptional
          accessibilityRole='text'
        />
        {sendingStatus === 'failed' && (
          <Text variant='body2' style={{ textAlign: 'left' }}>
            {t($ => $.feedback.failedSendingFeedback)}
          </Text>
        )}
        <PrivacyCheckbox language={language} checked={privacyPolicyAccepted} setChecked={setPrivacyPolicyAccepted} />
        {submitFeedbackDisabled && (
          <Note text={t($ => (feedbackMissing ? $.feedback.noteFillFeedback : $.common.notePrivacyPolicy))} />
        )}
        <Button disabled={submitFeedbackDisabled} onPress={onSubmit} mode='contained' style={{ marginTop: 16 }}>
          {t($ => $.feedback.send)}
        </Button>
      </Wrapper>
    </KeyboardAwareScrollView>
  )
}

export default Feedback
