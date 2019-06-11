// @flow

import * as React from 'react'
import styled from 'styled-components/native'
import { Picker, ScrollView, TextInput } from 'react-native'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import type { NavigationScreenProp } from 'react-navigation'
import Caption from '../../../modules/common/components/Caption'
import type { TFunction } from 'react-i18next'
import { Button } from 'react-native-elements'
import FeedbackVariant from '../FeedbackVariant'
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
  feedbackItems: Array<FeedbackVariant>,
  isPositiveFeedback: boolean
}

type StateType = {
  comment: string,
  feedbackItem: ?FeedbackVariant
}

class FeedbackModal extends React.Component<PropsType, StateType> {
  state = {comment: '', feedbackItem: null}

  onFeedbackVariantChanged = (itemValue: FeedbackVariant) => this.setState({feedbackItem: itemValue})

  onFeedbackCommentChanged = (comment: string) => this.setState({comment})

  onSubmit = () => {} // todo: NATIVE-208

  render () {
    const {theme, t, isPositiveFeedback, feedbackItems} = this.props
    const {feedbackItem, comment} = this.state

    return <ScrollView>
      <Wrapper theme={theme}>
        <Caption theme={theme} title={t('feedback')} />
        <Description theme={theme}>{t('feedbackType')}</Description>
        <Picker selectedValue={feedbackItem}
                onValueChange={this.onFeedbackVariantChanged}
                mode={'dropdown'}>
          {feedbackItems.map(item => <Picker.Item label={item.label} value={item} key={item.label} />)}
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
