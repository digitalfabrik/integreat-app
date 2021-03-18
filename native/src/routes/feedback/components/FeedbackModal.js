// @flow

import * as React from 'react'
import styled from 'styled-components/native'
import { Picker } from '@react-native-picker/picker'
import { ActivityIndicator, ScrollView, Text, TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Button } from 'react-native-elements'
import type { ThemeType } from 'build-configs/ThemeType'
import type { TFunction } from 'react-i18next'
import FeedbackVariant from '../FeedbackVariant'
import Caption from '../../../modules/common/components/Caption'
import buildConfig from '../../../modules/app/constants/buildConfig'
import type { SendingStatusType } from '../containers/FeedbackModalContainer'

const Input = styled(TextInput)`
  padding: 15px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.themeColor};
  text-align-vertical: top;
`

const MailInput = styled(Input)`
  height: 50px;
`

const Wrapper = styled.View`
  padding: 40px;
  background-color: ${props => props.theme.colors.backgroundColor};
`

const DescriptionContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 15px 0 5px;
`

const ThemedText = styled.Text`
  display: flex;
  text-align: left;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.decorativeFontRegular};
`

const Description = styled(ThemedText)`
  font-weight: bold;
`

export type PropsType = {|
  comment: string,
  contactMail: string,
  selectedFeedbackIndex: number,
  sendingStatus: SendingStatusType,
  feedbackOptions: Array<FeedbackVariant>,
  onCommentChanged: (comment: string) => void,
  onFeedbackContactMailChanged: (contactMail: string) => void,
  onFeedbackOptionChanged: (value: string | number, index: number) => void,
  isPositiveFeedback: boolean,
  onSubmit: () => Promise<void>,
  theme: ThemeType,
  t: TFunction
|}

const FeedbackModal = (props: PropsType) => {
  const renderBox = (): React.Node => {
    const {
      theme,
      t,
      isPositiveFeedback,
      feedbackOptions,
      selectedFeedbackIndex,
      comment,
      contactMail,
      sendingStatus
    } = props
    const feedbackItem = feedbackOptions[selectedFeedbackIndex]

    if (['idle', 'failed'].includes(sendingStatus)) {
      return (
        <>
          <Caption theme={theme} title={t('feedback')} />
          <Description theme={theme}>{t('feedbackType')}</Description>
          <Picker
            selectedValue={feedbackOptions.indexOf(feedbackItem)}
            onValueChange={props.onFeedbackOptionChanged}
            mode='dropdown'>
            {feedbackOptions.map((item, index) => (
              <Picker.Item label={item.label} value={index} key={index} />
            ))}
          </Picker>

          <DescriptionContainer theme={theme}>
            <Description theme={theme}>{isPositiveFeedback ? t('positiveComment') : t('negativeComment')}</Description>
            {isPositiveFeedback && <Text>({t('optionalInfo')})</Text>}
          </DescriptionContainer>
          <Input theme={theme} onChangeText={props.onCommentChanged} value={comment} multiline numberOfLines={3} />

          <DescriptionContainer theme={theme}>
            <Description theme={theme}>{t('contactMailAddress')}</Description>
            <Text>({t('optionalInfo')})</Text>
          </DescriptionContainer>

          <MailInput theme={theme} onChangeText={props.onFeedbackContactMailChanged} value={contactMail} />

          {sendingStatus === 'failed' && <Description theme={theme}>{t('failedSendingFeedback')}</Description>}

          <Button
            icon={<Icon name='send' size={15} color='black' style='material' />}
            titleStyle={{ color: theme.colors.textColor }}
            buttonStyle={{ backgroundColor: theme.colors.themeColor, marginTop: 15 }}
            disabled={!isPositiveFeedback && !comment}
            onPress={props.onSubmit}
            title={t('send')}
          />
        </>
      )
    } else if (sendingStatus === 'sending') {
      return <ActivityIndicator size='large' color='#0000ff' />
    } else {
      // sendingStatus === 'successful') {
      return (
        <>
          <Caption theme={theme} title={t('feedback:feedbackSent')} />
          <ThemedText theme={theme}>{t('feedback:thanksMessage', { appName: buildConfig().appName })}</ThemedText>
        </>
      )
    }
  }

  const { theme } = props
  return (
    <ScrollView>
      <Wrapper theme={theme}>{renderBox()}</Wrapper>
    </ScrollView>
  )
}

export default FeedbackModal
