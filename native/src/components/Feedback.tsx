import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Button } from 'react-native-paper'
import styled from 'styled-components/native'

import buildConfig from '../constants/buildConfig'
import useNavigate from '../hooks/useNavigate'
import Caption from './Caption'
import FeedbackButtons from './FeedbackButtons'
import { SendingStatusType } from './FeedbackContainer'
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
  isPositiveFeedback: boolean | null
  setIsPositiveFeedback: (isPositive: boolean | null) => void
  onSubmit: () => void
  searchTerm?: string
  setSearchTerm: (newTerm: string) => void
}

const Feedback = ({
  language,
  isPositiveFeedback,
  comment,
  contactMail,
  sendingStatus,
  setIsPositiveFeedback,
  onFeedbackContactMailChanged,
  onCommentChanged,
  onSubmit,
  searchTerm,
  setSearchTerm,
}: FeedbackProps): ReactElement => {
  const { t } = useTranslation('feedback')
  const navigation = useNavigate().navigation

  const isSearchFeedback = searchTerm !== undefined
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false)
  const feedbackFilled = isPositiveFeedback === null && comment.trim().length === 0 && !searchTerm
  const submitFeedbackDisabled = feedbackFilled || !privacyPolicyAccepted

  if (sendingStatus === 'sending') {
    return <LoadingSpinner />
  }

  if (sendingStatus === 'successful') {
    return (
      <Wrapper>
        <Caption title={t('thanksHeadline')} />
        <Text>{t('thanksMessage')}</Text>
        <Button onPress={navigation.goBack} mode='contained' style={{ marginTop: 16 }}>
          {t('common:close')}
        </Button>
      </Wrapper>
    )
  }

  return (
    <KeyboardAwareScrollView>
      <Wrapper>
        {isSearchFeedback ? (
          <InputSection
            title={t('searchTermDescription')}
            value={searchTerm}
            onChange={setSearchTerm}
            accessibilityRole='search'
          />
        ) : (
          <>
            <Caption title={t('headline')} />
            <FeedbackButtons isPositiveFeedback={isPositiveFeedback} setIsPositiveFeedback={setIsPositiveFeedback} />
          </>
        )}
        <InputSection
          title={t('commentHeadline')}
          description={t('commentDescription', { appName: buildConfig().appName })}
          value={comment}
          onChange={onCommentChanged}
          multiline
          showOptional
          accessibilityRole='text'
        />
        <InputSection
          title={t('contactMailAddress')}
          value={contactMail}
          onChange={onFeedbackContactMailChanged}
          keyboardType='email-address'
          showOptional
          accessibilityRole='text'
        />
        {sendingStatus === 'failed' && (
          <Text variant='body2' style={{ textAlign: 'left' }}>
            {t('failedSendingFeedback')}
          </Text>
        )}
        <PrivacyCheckbox language={language} checked={privacyPolicyAccepted} setChecked={setPrivacyPolicyAccepted} />
        {submitFeedbackDisabled && <Note text={t(feedbackFilled ? 'noteFillFeedback' : 'common:notePrivacyPolicy')} />}
        <Button disabled={submitFeedbackDisabled} onPress={onSubmit} mode='contained' style={{ marginTop: 16 }}>
          {t('send')}
        </Button>
      </Wrapper>
    </KeyboardAwareScrollView>
  )
}

export default Feedback
