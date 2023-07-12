import NoteIcon from 'integreat-app/assets/icons/note.svg'
import * as React from 'react'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, ScrollView, Text, TextInput } from 'react-native'
import { Button } from 'react-native-elements'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import useNavigate from '../hooks/useNavigate'
import Caption from './Caption'
import FeedbackButtons from './FeedbackButtons'
import { SendingStatusType } from './FeedbackContainer'

const Input = styled(TextInput)`
  padding: 15px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.themeColor};
  text-align-vertical: top;
  color: ${props => props.theme.colors.textColor};
`
const MailInput = styled(Input)`
  height: 50px;
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
`

const NoteBox = styled.View<{ visible: boolean }>`
  background-color: ${props => props.theme.colors.themeColor};
  margin-top: 12px;
  padding: 8px;
  opacity: ${props => (props.visible ? 1 : 0)};
  flex-direction: row;
`

const NoteText = styled.Text`
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
  padding-left: 8px;
`

const StyledNoteIcon = styled(NoteIcon)`
  align-self: center;
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
}: FeedbackProps): ReactElement => {
  const { t } = useTranslation('feedback')
  const theme = useTheme()
  const navigation = useNavigate().navigation

  const submitDisabled = isPositiveFeedback === null && comment.trim().length === 0

  const renderBox = (): React.ReactNode => {
    if (['idle', 'failed'].includes(sendingStatus)) {
      return (
        <>
          {!isSearchFeedback && <Caption title={t('headline')} />}
          <DescriptionContainer>
            <Text>{t('description')}</Text>
          </DescriptionContainer>
          <FeedbackButtons isPositiveFeedback={isPositiveFeedback} setIsPositiveFeedback={setIsPositiveFeedback} />
          <HeadlineContainer>
            <Description>{t('commentHeadline')}</Description>
            <Text>({t('optionalInfo')})</Text>
          </HeadlineContainer>
          <DescriptionContainer>
            <Text>{t('commentDescription')}</Text>
          </DescriptionContainer>
          <Input
            onChangeText={onCommentChanged}
            value={comment}
            multiline
            numberOfLines={3}
            autoFocus={!isSearchFeedback}
          />
          <HeadlineContainer>
            <Description>{t('contactMailAddress')}</Description>
            <Text>({t('optionalInfo')})</Text>
          </HeadlineContainer>
          <MailInput keyboardType='email-address' onChangeText={onFeedbackContactMailChanged} value={contactMail} />
          {sendingStatus === 'failed' && <Description>{t('failedSendingFeedback')}</Description>}
          <NoteBox visible={submitDisabled}>
            <StyledNoteIcon height={20} width={20} />
            <NoteText>{t('note')}</NoteText>
          </NoteBox>

          <Button
            titleStyle={{
              color: theme.colors.textColor,
              fontWeight: '600',
            }}
            buttonStyle={{
              backgroundColor: theme.colors.themeColor,
              marginTop: 15,
              borderRadius: 4,
            }}
            disabled={submitDisabled}
            onPress={onSubmit}
            title={t('send')}
          />
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
        <Button
          titleStyle={{
            color: theme.colors.textColor,
            fontWeight: '600',
          }}
          buttonStyle={{
            backgroundColor: theme.colors.themeColor,
            marginTop: 15,
            borderRadius: 4,
          }}
          onPress={navigation.goBack}
          title={t('close')}
        />
      </>
    )
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps='handled'
      style={{
        backgroundColor: theme.colors.backgroundColor,
      }}>
      <Wrapper theme={theme}>{renderBox()}</Wrapper>
    </ScrollView>
  )
}

export default Feedback
