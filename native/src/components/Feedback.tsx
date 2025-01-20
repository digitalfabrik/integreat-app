import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import styled from 'styled-components/native'

import buildConfig from '../constants/buildConfig'
import useNavigate from '../hooks/useNavigate'
import useSnackbar from '../hooks/useSnackbar'
import Caption from './Caption'
import FeedbackButtons from './FeedbackButtons'
import { SendingStatusType } from './FeedbackContainer'
import HorizontalLine from './HorizontalLine'
import LoadingSpinner from './LoadingSpinner'
import Note from './Note'
import NothingFound from './NothingFound'
import PrivacyCheckbox from './PrivacyCheckbox'
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
  const [privacyCheckedFilter, setPrivacyCheckedFilter] = useState(false)
  const showSnackbar = useSnackbar()
  const submitDisabled = isPositiveFeedback === null && comment.trim().length === 0 && !searchTerm

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
          <>
            <NothingFound />
            <HorizontalLine />
            <InputSection title={t('searchTermDescription')} value={searchTerm} onChange={setSearchTerm} />
          </>
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
        <PrivacyCheckbox
          checked={privacyCheckedFilter}
          setChecked={setPrivacyCheckedFilter}
          showSnackbar={showSnackbar}
        />
        {!isSearchFeedback && submitDisabled && <Note text={t('note')} />}
        <StyledButton disabled={submitDisabled || !privacyCheckedFilter} onPress={onSubmit} text={t('send')} />
      </Wrapper>
    </KeyboardAwareScrollView>
  )
}

export default Feedback
