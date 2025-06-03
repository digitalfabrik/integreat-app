import styled from '@emotion/styled'
import SendIcon from '@mui/icons-material/Send'
import Button from '@mui/material/Button'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import buildConfig from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import FeedbackButtons from './FeedbackButtons'
import { SendingStatusType } from './FeedbackContainer'
import Note from './Note'
import PrivacyCheckbox from './PrivacyCheckbox'
import Input from './base/Input'
import InputSection from './base/InputSection'

export const Container = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex: 1;
  max-height: 80vh;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  border-radius: 10px;
  border-color: ${props => props.theme.colors.textSecondaryColor};
  font-size: ${props => props.theme.fonts.contentFontSize};
  overflow: auto;
  align-self: center;
  gap: 16px;

  @media ${dimensions.mediumLargeViewport} {
    width: ${props => (props.fullWidth ? 'auto' : '400px')};
  }
`

const ErrorSendingStatus = styled.div`
  font-weight: bold;
`

type FeedbackProps = {
  language: string
  isPositiveFeedback: boolean | null
  comment: string
  contactMail: string
  onCommentChanged: (comment: string) => void
  onContactMailChanged: (contactMail: string) => void
  onFeedbackChanged?: (isPositiveFeedback: boolean | null) => void
  onSubmit: () => void
  sendingStatus: SendingStatusType
  searchTerm: string | undefined
  setSearchTerm: (newTerm: string) => void
  closeFeedback: (() => void) | undefined
}

const Feedback = ({
  language,
  isPositiveFeedback,
  comment,
  contactMail,
  sendingStatus,
  onSubmit,
  onCommentChanged,
  onContactMailChanged,
  onFeedbackChanged,
  searchTerm,
  setSearchTerm,
  closeFeedback,
}: FeedbackProps): ReactElement => {
  const { t } = useTranslation('feedback')

  const isSearchFeedback = searchTerm !== undefined
  const commentTitle = isSearchFeedback ? 'wantedInformation' : 'commentHeadline'
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false)
  const feedbackFilled = isPositiveFeedback === null && comment.trim().length === 0 && !searchTerm
  const submitFeedbackDisabled = feedbackFilled || !privacyPolicyAccepted

  if (sendingStatus === 'successful') {
    return (
      <Container>
        <div>{t('thanksMessage')}</div>
        {!!closeFeedback && !isSearchFeedback && <Button onClick={closeFeedback}>{t('common:close')}</Button>}
      </Container>
    )
  }

  return (
    <Container fullWidth={isSearchFeedback}>
      {isSearchFeedback ? (
        <InputSection id='searchTerm' title={t('searchTermDescription')}>
          <Input id='searchTerm' value={searchTerm} onChange={setSearchTerm} />
        </InputSection>
      ) : (
        onFeedbackChanged && <FeedbackButtons isPositive={isPositiveFeedback} onRatingChange={onFeedbackChanged} />
      )}

      <InputSection
        id='comment'
        title={t(commentTitle)}
        description={t('commentDescription', { appName: buildConfig().appName })}
        showOptional>
        <Input id='comment' value={comment} onChange={onCommentChanged} multiline />
      </InputSection>

      <InputSection id='email' title={t('contactMailAddress')} showOptional>
        <Input id='email' value={contactMail} onChange={onContactMailChanged} />
      </InputSection>
      <PrivacyCheckbox language={language} checked={privacyPolicyAccepted} setChecked={setPrivacyPolicyAccepted} />
      {submitFeedbackDisabled && <Note text={t(feedbackFilled ? 'noteFillFeedback' : 'notePrivacyPolicy')} />}
      {sendingStatus === 'failed' && <ErrorSendingStatus role='alert'>{t('failedSendingFeedback')}</ErrorSendingStatus>}
      <Button onClick={onSubmit} variant='contained' startIcon={<SendIcon />} disabled={submitFeedbackDisabled}>
        {t('send')}
      </Button>
    </Container>
  )
}

export default Feedback
