// @flow

import * as React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import styled from 'styled-components/native'
import type { ThemeType } from '../../theme/constants/theme'

const FeedbackBox = styled.View`
  margin-top: 25px;
  padding: 15px 5px;
  background-color: ${props => props.theme.colors.backgroundAccentColor};
`

const FeedbackButtons = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 10px;
`

const HelpfulText = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.decorativeFontBold};
  align-self: center;
`

const FeedbackTouchableOpacity = styled(TouchableOpacity)`
  align-items: center;
`

const FeedbackText = styled(Text)`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.decorativeFontRegular};
  font-size: 12;
  margin-top: -2px;
`

type PropType = {|
  navigateToFeedback: (positive: boolean) => void,
  theme: ThemeType
|}

class SiteHelpfulBox extends React.Component<PropType> {
  navigateToFeedback = (positive: boolean) => () => this.props.navigateToFeedback(positive)

  render () {
    const {theme} = this.props
    return <FeedbackBox theme={theme}>
      <HelpfulText theme={theme}>Ist diese Seite hilfreich?</HelpfulText>
      <FeedbackButtons>
        <FeedbackTouchableOpacity theme={theme} onPress={this.navigateToFeedback(true)}>
          <Icon name='sentiment-satisfied' size={25} type='material' reverseColor={theme.colors.textColor} reverse
                color={theme.colors.themeColor} />
          <FeedbackText theme={theme}>Hilfreich</FeedbackText>
        </FeedbackTouchableOpacity>
        <FeedbackTouchableOpacity theme={theme} onPress={this.navigateToFeedback(false)}>
          <Icon name='sentiment-dissatisfied' size={25} type='material' reverseColor={theme.colors.textColor} reverse
                color={theme.colors.themeColor} />
          <FeedbackText theme={theme}>Nicht hilfreich</FeedbackText>
        </FeedbackTouchableOpacity>
      </FeedbackButtons>
    </FeedbackBox>
  }
}

export default SiteHelpfulBox
