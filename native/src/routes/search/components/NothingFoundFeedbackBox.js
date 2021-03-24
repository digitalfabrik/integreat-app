// @flow

import React, { useState } from 'react'
import { ActivityIndicator, Text, TextInput } from 'react-native'
import { Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/MaterialIcons'
import type { ThemeType } from 'build-configs/ThemeType'
import type { TFunction } from 'react-i18next'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import buildConfig from '../../../modules/app/constants/buildConfig'

const Input: StyledComponent<{||}, ThemeType, *> = styled(TextInput)`
  margin-bottom: 15px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.textSecondaryColor};
`

const DescriptionText: StyledComponent<{||}, ThemeType, *> = styled(Text)`
  margin-top: 20px;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
`

const TitleText: StyledComponent<{||}, ThemeType, *> = styled.Text`
  text-align: center;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
`

type PropsType = {|
  query: string,
  t: TFunction,
  theme: ThemeType,
  sendFeedback: (comment: string, query: string) => Promise<void>
|}

type SendingStatusType = 'idle' | 'sending' | 'failed' | 'successful'

const NothingFoundFeedbackBox = ({ query, t, theme, sendFeedback }: PropsType) => {
  const [comment, setComment] = useState<string>('')
  const [sendingStatus, setSendingStatus] = useState<SendingStatusType>('idle')

  const onCommentChanged = (value: string) => setComment(value)

  const onSubmit = async () => {
    setSendingStatus('sending')
    sendFeedback(comment, query)
      .then(() => setSendingStatus('successful'))
      .catch(() => setSendingStatus('failed'))
  }

  if (['idle', 'failed'].includes(sendingStatus)) {
    return (
      <>
        <TitleText>{t('feedback:nothingFound')}</TitleText>
        {sendingStatus === 'failed' && <DescriptionText>{t('feedback:failedSendingFeedback')}</DescriptionText>}
        <DescriptionText>{t('feedback:wantedInformation')}</DescriptionText>
        <Input
          onChangeText={onCommentChanged}
          value={comment}
          multiline
          placeholderTextColor={theme.colors.textSecondaryColor}
          placeholder={t('feedback:yourFeedback')}
        />
        <Button
          icon={<Icon name='send' size={15} color='black' style='material' />}
          titleStyle={{ color: theme.colors.textColor }}
          buttonStyle={{ backgroundColor: theme.colors.themeColor }}
          onPress={onSubmit}
          title={t('feedback:send')}
        />
      </>
    )
  } else if (sendingStatus === 'sending') {
    return <ActivityIndicator size='large' color='#0000ff' />
  } else {
    // sendingStatus === 'successful'
    return (
      <>
        <TitleText>{t('feedback:feedbackSent')}</TitleText>
        <DescriptionText>{t('feedback:thanksMessage', { appName: buildConfig().appName })}</DescriptionText>
      </>
    )
  }
}

export default NothingFoundFeedbackBox
