// @flow

import * as React from 'react'
import styled from 'styled-components/native'
import { Picker, ScrollView, TextInput } from 'react-native'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import type { NavigationScreenProp } from 'react-navigation'
import Caption from '../../../modules/common/components/Caption'
import type { TFunction } from 'react-i18next'
import { Button } from 'react-native-elements'
import FeedbackDropdownItem from '../FeedbackDropdownItem'
import Icon from 'react-native-vector-icons/MaterialIcons'

const Wrapper = styled.View`
  padding: 40px;
  background-color: ${props => props.theme.colors.backgroundColor};
`

const Description = styled.Text`
    padding: 15px 0 5px;
    color: ${props => props.theme.colors.textColor};
    font-family: ${props => props.theme.fonts.decorativeFontRegular};
`

type PropsType = {
  theme: ThemeType,
  closeModal: () => void,
  navigation: NavigationScreenProp<*>,
  t: TFunction,
  feedbackItems: Array<FeedbackDropdownItem>,
  isPositiveFeedback: boolean
}

type StateType = {
  comment: string,
  feedbackItem: FeedbackDropdownItem
}

class FeedbackModal extends React.Component<PropsType, StateType> {
  state = {comment: '', feedbackItem: null}

  onFeedbackTypeChanged = (itemValue: FeedbackDropdownItem) => this.setState({feedbackItem: itemValue})

  onFeedbackCommentChanged = (comment: string) => this.setState({comment})

  onSubmit = () => this.props.onSubmit(this.state.feedbackItem, this.state.comment)

  render () {
    const {theme, t, isPositiveFeedback, feedbackItems} = this.props
    const {feedbackItem, comment} = this.state

    return <ScrollView>
      <Wrapper theme={theme}>
        <Caption theme={theme} title={t('feedback')} />
        <Description theme={theme}>{t('feedbackType')}</Description>
        <Picker selectedValue={feedbackItem}
                onValueChange={this.onFeedbackTypeChanged}
                mode={'dropdown'}>
          {feedbackItems.map(item => <Picker.Item label={item.label} value={item} key={item} />)}
        </Picker>
        <Description theme={theme}>{isPositiveFeedback ? t('positiveComment') : t('negativeComment')}</Description>
        <TextInput underlineColorAndroid={theme.colors.textDecorationColor} onChangeText={this.onFeedbackCommentChanged}
                   value={comment} multiline />
        <Button icon={<Icon name='send' size={15} color='black' style='material' />}
                titleStyle={{color: theme.colors.textColor}}
                buttonStyle={{backgroundColor: theme.colors.themeColor}}
                onClick={this.onSubmit} title={t('send')} />
      </Wrapper>
    </ScrollView>
  }
}

export default FeedbackModal
