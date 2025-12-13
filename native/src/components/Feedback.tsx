import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
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
import TextButton from './base/TextButton'

const Wrapper = styled.View`
  gap: 8px;
`

const Description = styled(Text)`
  font-weight: bold;
  text-align: left;
  color: ${props => props.theme.colors.onSurface};
`

const StyledButton = styled(TextButton)`
  margin-top: 16px;
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
        <StyledButton onPress={navigation.goBack} text={t('common:close')} />
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
        {sendingStatus === 'failed' && <Description>{t('failedSendingFeedback')}</Description>}
        <PrivacyCheckbox language={language} checked={privacyPolicyAccepted} setChecked={setPrivacyPolicyAccepted} />
        {submitFeedbackDisabled && <Note text={t(feedbackFilled ? 'noteFillFeedback' : 'common:notePrivacyPolicy')} />}
        <StyledButton disabled={submitFeedbackDisabled} onPress={onSubmit} text={t('send')} />
      </Wrapper>
    </KeyboardAwareScrollView>
  )
}

export default Feedback
