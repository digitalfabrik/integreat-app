// @flow

import * as React from 'react'
import styled from 'styled-components/native'
import { ActivityIndicator, Picker, ScrollView, TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Button } from 'react-native-elements'
import type { ThemeType } from '../../../modules/theme/constants'
import type { NavigationStackProp } from 'react-navigation-stack'
import type { TFunction } from 'react-i18next'
import FeedbackVariant from '../FeedbackVariant'
import Caption from '../../../modules/common/components/Caption'
import type { FeedbackParamsType } from 'api-client'
import buildConfig from '../../../modules/app/constants/buildConfig'

const Input = styled(TextInput)`
  margin-bottom: 15px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.textSecondaryColor};
`

const Wrapper = styled.View`
  padding: 40px;
  background-color: ${props => props.theme.colors.backgroundColor};
`

const Description = styled.Text`
    padding: 15px 0 5px;
    color: ${props => props.theme.colors.textColor};
    font-family: ${props => props.theme.fonts.decorativeFontRegular};
`

const RequiredText = styled.Text`
    color: red;
    fontSize: 25px
`

type PropsType = {|
  theme: ThemeType,
  closeModal: () => void,
  navigation: NavigationStackProp<*>,
  t: TFunction,
  feedbackItems: Array<FeedbackVariant>,
  isPositiveFeedback: boolean,
  sendFeedback: (params: FeedbackParamsType) => Promise<void>
|}

type SendingStatusType = 'idle' | 'sending' | 'failed' | 'successful'

type StateType = {|
  comment: string,
  feedbackIndex: number,
  sendingStatus: SendingStatusType
|}

class FeedbackModal extends React.Component<PropsType, StateType> {
  state = { comment: '', feedbackIndex: 0, sendingStatus: 'idle' }

  onFeedbackVariantChanged = (value: string | number, index: number) => this.setState({ feedbackIndex: index })

  onFeedbackCommentChanged = (comment: string) => this.setState({ comment })

  onSubmit = () => {
    const { feedbackIndex, comment } = this.state
    const feedbackItem = this.props.feedbackItems[feedbackIndex]
    const feedbackData: FeedbackParamsType = {
      feedbackType: feedbackItem.feedbackType,
      feedbackCategory: feedbackItem.feedbackCategory,
      isPositiveRating: this.props.isPositiveFeedback,
      comment: comment,
      permalink: feedbackItem.pagePath || undefined,
      alias: feedbackItem.alias || undefined,
      city: feedbackItem.city,
      language: feedbackItem.language
    }
    this.setState({ sendingStatus: 'sending' })
    this.props.sendFeedback(feedbackData)
      .then(() => this.setState({ sendingStatus: 'successful' }))
      .catch(() => this.setState({ sendingStatus: 'failed' }))
  }

  renderBox (): React.Node {
    const { theme, t, isPositiveFeedback, feedbackItems } = this.props
    const { feedbackIndex, comment, sendingStatus } = this.state
    const feedbackItem = feedbackItems[feedbackIndex]

    if (['idle', 'failed'].includes(sendingStatus)) {
      return <>
        <Caption theme={theme} title={t('feedback')} />
        <Description theme={theme}>{t('feedbackType')}</Description>
        <Picker selectedValue={feedbackItems.indexOf(feedbackItem)}
                onValueChange={this.onFeedbackVariantChanged}
                mode='dropdown'>
          {feedbackItems.map((item, index) => <Picker.Item label={item.label} value={index} key={index} />)}
        </Picker>
        <Description theme={theme}> {isPositiveFeedback ? t('positiveComment') : t('negativeComment')}{!isPositiveFeedback && <RequiredText>*</RequiredText>}</Description>
        <Input theme={theme} onChangeText={this.onFeedbackCommentChanged}
               autoFocus value={comment} multiline placeholderTextColor={theme.colors.textSecondaryColor}
               placeholder={t('yourFeedback')} />
        {sendingStatus === 'failed' && <Description theme={theme}>{t('failedSendingFeedback')}</Description>}
        <Button icon={<Icon name='send' size={15} color='black' style='material' />}
                titleStyle={{ color: theme.colors.textColor }}
                buttonStyle={{ backgroundColor: theme.colors.themeColor }}
                disabled={!isPositiveFeedback && !comment}
                onPress={this.onSubmit} title={t('send')} />
      </>
    } else if (sendingStatus === 'sending') {
      return <ActivityIndicator size='large' color='#0000ff' />
    } else { // sendingStatus === 'successful') {
      return <>
        <Caption theme={theme} title={t('feedback:feedbackSent')} />
        <Description theme={theme}>{t('feedback:thanksMessage', { appName: buildConfig().appName })}</Description>
      </>
    }
  }

  render () {
    const { theme } = this.props
    return <ScrollView>
      <Wrapper theme={theme}>
        {this.renderBox()}
      </Wrapper>
    </ScrollView>
  }
}

export default FeedbackModal
