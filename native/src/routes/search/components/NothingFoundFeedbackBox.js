// @flow

import React from 'react'
import { ActivityIndicator, Text, TextInput } from 'react-native'
import { Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/MaterialIcons'
import type { ThemeType } from '../../../modules/theme/constants'
import type { TFunction } from 'react-i18next'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import buildConfig from '../../../modules/app/constants/buildConfig'

const Input = styled(TextInput)`
  margin-bottom: 15px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.textSecondaryColor};
`

const DescriptionText: StyledComponent<{}, ThemeType, *> = styled(Text)`
  margin-top: 20px;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.decorativeFontRegular};
`

const TitleText = styled.Text`
  text-align: center;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.decorativeFontBold};
`

type PropsType = {|
  query: string,
  t: TFunction,
  theme: ThemeType,
  sendFeedback: (comment: string, query: string) => Promise<void>
|}

type SendingStatusType = 'idle' | 'sending' | 'failed' | 'successful'

type StateType = {|
  comment: string,
  sendingStatus: SendingStatusType
|}

class NothingFoundFeedbackBox extends React.Component<PropsType, StateType> {
  state = { comment: '', sendingStatus: 'idle' }

  onCommentChanged = (value: string) => this.setState({ comment: value })

  onSubmit = async () => {
    this.setState({ sendingStatus: 'sending' })
    this.props
      .sendFeedback(this.state.comment, this.props.query)
      .then(() => this.setState({ sendingStatus: 'successful' }))
      .catch(() => this.setState({ sendingStatus: 'failed' }))
  }

  render() {
    const { sendingStatus, comment } = this.state
    const { t, theme } = this.props

    if (['idle', 'failed'].includes(sendingStatus)) {
      return (
        <>
          <TitleText theme={theme}>{t('feedback:nothingFound')}</TitleText>
          {sendingStatus === 'failed' && (
            <DescriptionText theme={theme}>{t('feedback:failedSendingFeedback')}</DescriptionText>
          )}
          <DescriptionText theme={theme}>{t('feedback:wantedInformation')}</DescriptionText>
          <Input
            theme={theme}
            onChangeText={this.onCommentChanged}
            value={comment}
            multiline
            placeholderTextColor={theme.colors.textSecondaryColor}
            placeholder={t('feedback:yourFeedback')}
          />
          <Button
            icon={<Icon name='send' size={15} color='black' style='material' />}
            titleStyle={{ color: theme.colors.textColor }}
            buttonStyle={{ backgroundColor: theme.colors.themeColor }}
            onPress={this.onSubmit}
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
          <TitleText theme={theme}>{t('feedback:feedbackSent')}</TitleText>
          <DescriptionText theme={theme}>
            {t('feedback:thanksMessage', { appName: buildConfig().appName })}
          </DescriptionText>
        </>
      )
    }
  }
}

export default NothingFoundFeedbackBox
