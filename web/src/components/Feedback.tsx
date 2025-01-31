import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import buildConfig from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import Failure from './Failure'
import FeedbackButtons from './FeedbackButtons'
import { SendingStatusType } from './FeedbackContainer'
import Note from './Note'
import PrivacyCheckbox from './PrivacyCheckbox'
import Input from './base/Input'
import InputSection from './base/InputSection'
import TextButton from './base/TextButton'

export const Container = styled.div<{ $fullWidth?: boolean }>`
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
    width: ${props => (props.$fullWidth ? 'auto' : '400px')};
  }
`

const ErrorSendingStatus = styled.div`
  font-weight: bold;
`

const StyledTextButton = styled(TextButton)`
  margin: 0;
`

type FeedbackProps = {
  language: string
  isPositiveFeedback: boolean | null
  comment: string
  contactMail: string
  onCommentChanged: (comment: string) => void
  onContactMailChanged: (contactMail: string) => void
  onFeedbackChanged: (isPositiveFeedback: boolean | null) => void
  onSubmit: () => void
  sendingStatus: SendingStatusType
  noResults: boolean | undefined
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
  noResults,
  searchTerm,
  setSearchTerm,
  closeFeedback,
}: FeedbackProps): ReactElement => {
  const { t } = useTranslation('feedback')

  const isSearchFeedback = searchTerm !== undefined
  const commentTitle = isSearchFeedback ? 'wantedInformation' : 'commentHeadline'
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false)
  const sendFeedbackDisabled = isPositiveFeedback === null && comment.trim().length === 0 && !searchTerm

  if (sendingStatus === 'successful') {
    return (
      <Container>
        <div>{t('thanksMessage')}</div>
        {!!closeFeedback && !isSearchFeedback && <TextButton onClick={closeFeedback} text={t('common:close')} />}
      </Container>
    )
  }

  return (
    <Container $fullWidth={isSearchFeedback}>
      {isSearchFeedback ? (
        <>
          {noResults && <Failure errorMessage='search:nothingFound' />}
          <InputSection id='searchTerm' title={t('searchTermDescription')}>
            <Input id='searchTerm' value={searchTerm} onChange={setSearchTerm} />
          </InputSection>
        </>
      ) : (
        <FeedbackButtons isPositive={isPositiveFeedback} onRatingChange={onFeedbackChanged} />
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
      {!isSearchFeedback && sendFeedbackDisabled && <Note text={t('note')} />}
      {sendingStatus === 'failed' && <ErrorSendingStatus role='alert'>{t('failedSendingFeedback')}</ErrorSendingStatus>}
      <StyledTextButton disabled={sendFeedbackDisabled || !privacyPolicyAccepted} onClick={onSubmit} text={t('send')} />
    </Container>
  )
}

export default Feedback
