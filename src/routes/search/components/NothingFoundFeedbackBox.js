// @flow

import React from 'react'
import { TextInput, Text } from 'react-native'
import { Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/MaterialIcons'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import type { TFunction } from 'react-i18next'
import styled, { type StyledComponent } from 'styled-components/native'

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

type PropsType = {|
  query?: string,
  t: TFunction,
  theme: ThemeType
|}

type StateType = {|
  comment: string,
  feedbackSent: boolean
|}

class NothingFoundFeedbackBox extends React.Component<PropsType, StateType> {
  state = {comment: '', feedbackSent: false}

  onCommentChanged = (value: string) => this.setState({comment: value})

  onSubmit = () => {
    // todo: NATIVE-208 submit feedback
    this.setState({feedbackSent: true})
  }

  render () {
    const {feedbackSent, comment} = this.state
    const {t, theme} = this.props

    return feedbackSent
      ? <DescriptionText theme={theme}>{t('feedback:thanksMessage')}</DescriptionText>
      : <>
        <DescriptionText theme={theme}>{t('feedback:wantedInformation')}</DescriptionText>
        <Input theme={theme} onChangeText={this.onCommentChanged}
               value={comment} multiline placeholderTextColor={theme.colors.textSecondaryColor}
               placeholder={t('feedback:yourFeedback')} />
        <Button icon={<Icon name='send' size={15} color='black' style='material' />}
                titleStyle={{color: theme.colors.textColor}}
                buttonStyle={{backgroundColor: theme.colors.themeColor}}
                onPress={this.onSubmit} title={t('feedback:send')} />
      </>
  }
}

export default NothingFoundFeedbackBox
