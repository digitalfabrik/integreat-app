import * as React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import styled from 'styled-components/native'
import type { StyledComponent } from 'styled-components'
import 'styled-components'
import type { ThemeType } from '../../theme/constants'
import type { TFunction } from 'react-i18next'
import happyIcon from './assets/smile-happy.svg'
import sadIcon from './assets/smile-sad.svg'
import Image from './Image'
import { withTranslation } from 'react-i18next'
const FeedbackBoxContainer = styled.View`
  margin-top: auto;
`
const FeedbackBox: StyledComponent<{}, ThemeType, any> = styled.View`
  margin-top: 25px;
  padding: 15px 5px;
  background-color: ${props => props.theme.colors.backgroundAccentColor};
`
const FeedbackButtons: StyledComponent<{}, {}, any> = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 10px;
`
const HelpfulText: StyledComponent<{}, ThemeType, any> = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
  align-self: center;
`
const FeedbackTouchableOpacity: StyledComponent<{}, {}, any> = styled(TouchableOpacity)`
  align-items: center;
`
const FeedbackText: StyledComponent<{}, ThemeType, any> = styled(Text)`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
  font-size: 12px;
  margin-top: -2px;
`
const ICON_SIZE = 50
const Circle: StyledComponent<{}, ThemeType, any> = styled(View)`
  margin-top: 9px;
  margin-bottom: 5px;
  border-radius: ${ICON_SIZE}px;
  height: ${ICON_SIZE}px;
  width: ${ICON_SIZE}px;
  background-color: ${props => props.theme.colors.backgroundColor};
  align-items: center;
  justify-content: center;
`
const MAXIMAL_ICON_SIZE = ICON_SIZE / Math.sqrt(2)
const ICON_SCALE_FACTOR = 0.85
const Thumbnail = styled(Image)`
  height: ${MAXIMAL_ICON_SIZE * ICON_SCALE_FACTOR}px;
  width: ${MAXIMAL_ICON_SIZE * ICON_SCALE_FACTOR}px;
`
type PropsType = {
  navigateToFeedback: (positive: boolean) => void
  theme: ThemeType
  t: TFunction
}

class SiteHelpfulBox extends React.Component<PropsType> {
  navigateToFeedback = (positive: boolean) => () => this.props.navigateToFeedback(positive)

  render() {
    const { theme, t } = this.props
    return (
      <FeedbackBoxContainer>
        <FeedbackBox theme={theme}>
          <HelpfulText theme={theme}>{t('isThisSiteUseful')}</HelpfulText>
          <FeedbackButtons>
            <FeedbackTouchableOpacity theme={theme} onPress={this.navigateToFeedback(true)}>
              <Circle theme={theme}>
                <Thumbnail source={happyIcon} />
              </Circle>
              <FeedbackText theme={theme}>{t('useful')}</FeedbackText>
            </FeedbackTouchableOpacity>
            <FeedbackTouchableOpacity theme={theme} onPress={this.navigateToFeedback(false)}>
              <Circle theme={theme}>
                <Thumbnail source={sadIcon} />
              </Circle>
              <FeedbackText theme={theme}>{t('notUseful')}</FeedbackText>
            </FeedbackTouchableOpacity>
          </FeedbackButtons>
        </FeedbackBox>
      </FeedbackBoxContainer>
    )
  }
}

export default withTranslation<PropsType>('feedback')(SiteHelpfulBox)
