// @flow

import * as React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import styled, { type StyledComponent } from 'styled-components/native'
import type { ThemeType } from '../../theme/constants/theme'
import type { TFunction } from 'react-i18next'
import happyIcon from './assets/smile-happy.svg'
import sadIcon from './assets/smile-sad.svg'
import Image from './Image'
import { translate } from 'react-i18next'

const FeedbackBox: StyledComponent<{}, ThemeType, *> = styled.View`
  margin-top: 25px;
  padding: 15px 5px;
  background-color: ${props => props.theme.colors.backgroundAccentColor};
`

const FeedbackButtons: StyledComponent<{}, {}, *> = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 10px;
`

const HelpfulText: StyledComponent<{}, ThemeType, *> = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.decorativeFontBold};
  align-self: center;
`

const FeedbackTouchableOpacity: StyledComponent<{}, {}, *> = styled(TouchableOpacity)`
  align-items: center;
`

const FeedbackText: StyledComponent<{}, ThemeType, *> = styled(Text)`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.decorativeFontRegular};
  font-size: 12;
  margin-top: -2px;
`

const ICON_SIZE = 50

const Circle: StyledComponent<{}, ThemeType, *> = styled(View)`
  margin-top: 9px;
  margin-bottom: 5px;
  border-radius: ${ICON_SIZE}px;
  height: ${ICON_SIZE};
  width: ${ICON_SIZE};
  background-color: ${props => props.theme.colors.themeColor};
  align-items: center;
  justify-content: center;
`

const MAXIMAL_ICON_SIZE = ICON_SIZE / Math.sqrt(2)
const ICON_SCALE_FACTOR = 0.85
const Thumbnail = styled(Image)`
  height: ${MAXIMAL_ICON_SIZE * ICON_SCALE_FACTOR};
  width: ${MAXIMAL_ICON_SIZE * ICON_SCALE_FACTOR};
`

type PropType = {|
  navigateToFeedback: (positive: boolean) => void,
  theme: ThemeType,
  t: TFunction
|}

class SiteHelpfulBox extends React.Component<PropType> {
  navigateToFeedback = (positive: boolean) => () => this.props.navigateToFeedback(positive)

  render () {
    const { theme, t } = this.props
    return <FeedbackBox theme={theme}>
      <HelpfulText theme={theme}>{t('isThisSiteUseful')}</HelpfulText>
      <FeedbackButtons>
        <FeedbackTouchableOpacity theme={theme} onPress={this.navigateToFeedback(true)}>
          <Circle theme={theme}><Thumbnail source={happyIcon} /></Circle>
          <FeedbackText theme={theme}>{t('useful')}</FeedbackText>
        </FeedbackTouchableOpacity>
        <FeedbackTouchableOpacity theme={theme} onPress={this.navigateToFeedback(false)}>
          <Circle theme={theme}><Thumbnail source={sadIcon} /></Circle>
          <FeedbackText theme={theme}>{t('notUseful')}</FeedbackText>
        </FeedbackTouchableOpacity>
      </FeedbackButtons>
    </FeedbackBox>
  }
}

export default translate('feedback')(SiteHelpfulBox)
