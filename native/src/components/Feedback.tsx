import name from 'build-config-name'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, ScrollView, Text, TextInput } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { NoteIcon } from '../assets'
import useNavigate from '../hooks/useNavigate'
import Caption from './Caption'
import FeedbackButtons from './FeedbackButtons'
import { SendingStatusType } from './FeedbackContainer'
import Icon from './base/Icon'
import TextButton from './base/TextButton'

const Input = styled(TextInput)`
  padding: 15px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.themeColor};
  text-align-vertical: top;
  color: ${props => props.theme.colors.textColor};
`

const CommentInput = styled(Input)`
  height: 100px;
`

const Wrapper = styled.View`
  padding: 20px;
  background-color: ${props => props.theme.colors.backgroundColor};
`

const HeadlineContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 15px 0 5px;
`

const DescriptionContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 12px 0;
`

const ThemedText = styled.Text`
  display: flex;
  text-align: center;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
`

const Description = styled(ThemedText)`
  font-weight: bold;
  text-align: left;
`

const NoteBox = styled.View<{ visible: boolean }>`
  background-color: ${props => props.theme.colors.themeColor};
  margin-top: 12px;
  padding: 12px;
  opacity: ${props => (props.visible ? 1 : 0)};
  flex-direction: row;
`

const NoteText = styled.Text`
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
  font-size: 12px;
  flex: 1;
  flex-wrap: wrap;
`

const StyledIcon = styled(Icon)`
  align-self: center;
  margin-right: 12px;
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
  isSearchFeedback: boolean
  isPositiveFeedback: boolean | null
  setIsPositiveFeedback: (isPositive: boolean | null) => void
  onSubmit: () => void
  searchTerm?: string
  setSearchTerm: (newTerm: string) => void
}

const Feedback = ({
  isSearchFeedback,
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
  const theme = useTheme()
  const navigation = useNavigate().navigation

  const submitDisabled = isPositiveFeedback === null && comment.trim().length === 0 && !isSearchFeedback

  const renderBox = (): React.ReactNode => {
    if (['idle', 'failed'].includes(sendingStatus)) {
      return (
        <>
          {isSearchFeedback ? (
            <>
              <HeadlineContainer>
                <Description>{t('searchTermDescription')}</Description>
              </HeadlineContainer>
              <Input value={searchTerm} onChangeText={setSearchTerm} />
            </>
          ) : (
            <>
              <Caption title={t('headline')} />
              <DescriptionContainer>
                <Text>{t('description')}</Text>
              </DescriptionContainer>
              <FeedbackButtons isPositiveFeedback={isPositiveFeedback} setIsPositiveFeedback={setIsPositiveFeedback} />
            </>
          )}
          <HeadlineContainer>
            <Description>{t('commentHeadline')}</Description>
            <Text>({t('optionalInfo')})</Text>
          </HeadlineContainer>
          <DescriptionContainer>
            <Text>{t('commentDescription', { name })}</Text>
          </DescriptionContainer>
          <CommentInput onChangeText={onCommentChanged} value={comment} multiline numberOfLines={3} />
          <HeadlineContainer>
            <Description>{t('contactMailAddress')}</Description>
            <Text>({t('optionalInfo')})</Text>
          </HeadlineContainer>
          <Input keyboardType='email-address' onChangeText={onFeedbackContactMailChanged} value={contactMail} />
          {sendingStatus === 'failed' && <Description>{t('failedSendingFeedback')}</Description>}
          <NoteBox visible={submitDisabled}>
            <StyledIcon Icon={NoteIcon} />
            <NoteText>{t('note')}</NoteText>
          </NoteBox>
          <StyledButton disabled={submitDisabled} onPress={onSubmit} text={t('send')} />
        </>
      )
    }
    if (sendingStatus === 'sending') {
      return <ActivityIndicator size='large' color='#0000ff' />
    }
    // sendingStatus === 'successful'
    return (
      <>
        <Caption title={t('thanksHeadline')} />
        <ThemedText>{t('thanksMessage')}</ThemedText>
        <StyledButton onPress={navigation.goBack} text={t('common:close')} />
      </>
    )
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps='handled'
      style={{
        backgroundColor: theme.colors.backgroundColor,
      }}>
      <Wrapper>{renderBox()}</Wrapper>
    </ScrollView>
  )
}

export default Feedback
