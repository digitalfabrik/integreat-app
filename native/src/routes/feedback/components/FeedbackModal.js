// @flow

import * as React from 'react'
import styled from 'styled-components/native'
import { Picker } from '@react-native-picker/picker'
import { ActivityIndicator, ScrollView, TextInput } from 'react-native'
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

const Description = styled.Text`
  display: flex;
  text-align: left;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.decorativeFontRegular};
  font-weight: bold;
`

const RequiredText = styled.Text`
  color: red;
  fontsize: 25px;
`

const OptionalText = styled.Text`
  font-weight: normal;
`

export type PropsType = {|
  comment: string,
  selectedFeedbackIndex: number,
  sendingStatus: SendingStatusType,
  feedbackOptions: Array<FeedbackVariant>,
  onCommentChanged: (comment: string) => void,
  onFeedbackOptionChanged: (value: string | number, index: number) => void,
  isPositiveFeedback: boolean,
  onSubmit: () => Promise<void>,
  theme: ThemeType,
  t: TFunction
|}

class FeedbackModal extends React.Component<PropsType> {
  renderBox(): React.Node {
    const { theme, t, isPositiveFeedback, feedbackOptions, selectedFeedbackIndex, comment, sendingStatus } = this.props
    const feedbackItem = feedbackOptions[selectedFeedbackIndex]

    if (['idle', 'failed'].includes(sendingStatus)) {
      return (
        <>
          <Caption theme={theme} title={t('feedback')} />
          <Description theme={theme}>{t('feedbackType')}</Description>
          <Picker
            selectedValue={feedbackOptions.indexOf(feedbackItem)}
            onValueChange={this.props.onFeedbackOptionChanged}
            mode='dropdown'>
            {feedbackOptions.map((item, index) => (
              <Picker.Item label={item.label} value={index} key={index} />
            ))}
          </Picker>

          <Description theme={theme}>
            {' '}
            {isPositiveFeedback ? t('positiveComment') : t('negativeComment')}
            {!isPositiveFeedback && <RequiredText>*</RequiredText>}
          </Description>
          <Input theme={theme} onChangeText={this.props.onCommentChanged} autoFocus value={comment} multiline />

          <DescriptionContainer theme={theme}>
            <Description theme={theme}>{t('contactMailAddress')}</Description>
            <OptionalText>({t('optionalInfo')})</OptionalText>
          </DescriptionContainer>

          <Input theme={theme} /* onChangeText={this.props.onCommentChanged} */ autoFocus /* value={comment} */ />

          {sendingStatus === 'failed' && <Description theme={theme}>{t('failedSendingFeedback')}</Description>}
          <Button
            icon={<Icon name='send' size={15} color='black' style='material' />}
            titleStyle={{ color: theme.colors.textColor }}
            buttonStyle={{ backgroundColor: theme.colors.themeColor }}
            disabled={!isPositiveFeedback && !comment}
            onPress={this.props.onSubmit}
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
          <Description theme={theme}>{t('feedback:thanksMessage', { appName: buildConfig().appName })}</Description>
        </>
      )
    }
  }

  render() {
    const { theme } = this.props
    return (
      <ScrollView>
        <Wrapper theme={theme}>{this.renderBox()}</Wrapper>
      </ScrollView>
    )
  }
}

export default FeedbackModal
