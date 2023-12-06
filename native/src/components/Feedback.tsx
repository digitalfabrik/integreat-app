import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Text } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import styled from 'styled-components/native'

import buildConfig from '../constants/buildConfig'
import useNavigate from '../hooks/useNavigate'
import Caption from './Caption'
import FeedbackButtons from './FeedbackButtons'
import { SendingStatusType } from './FeedbackContainer'
import Note from './Note'
import InputSection from './base/InputSection'
import TextButton from './base/TextButton'

const Wrapper = styled.View`
  padding: 20px;
  gap: 8px;
`

const Description = styled(Text)`
  font-weight: bold;
  text-align: left;
`

const StyledButton = styled(TextButton)`
  margin-top: 16px;
`

export type FeedbackProps = {
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
  const submitDisabled = isPositiveFeedback === null && comment.trim().length === 0 && !isSearchFeedback

  if (sendingStatus === 'sending') {
    return <ActivityIndicator size='large' color='#0000ff' />
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
          <InputSection title={t('searchTermDescription')} value={searchTerm} onChange={setSearchTerm} />
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
        />
        <InputSection
          title={t('contactMailAddress')}
          value={contactMail}
          onChange={onFeedbackContactMailChanged}
          keyboardType='email-address'
          showOptional
        />
        {sendingStatus === 'failed' && <Description>{t('failedSendingFeedback')}</Description>}
        {!isSearchFeedback && <Note text={t('note')} visible={submitDisabled} />}
        <StyledButton disabled={submitDisabled} onPress={onSubmit} text={t('send')} />
      </Wrapper>
    </KeyboardAwareScrollView>
  )
}

export default Feedback
