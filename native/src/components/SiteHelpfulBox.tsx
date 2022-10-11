import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import happyIcon from '../assets/smile-happy.svg'
import sadIcon from '../assets/smile-sad.svg'
import SimpleImage from './SimpleImage'

const FeedbackBox = styled.View<{ backgroundColor?: string }>`
  margin-top: 25px;
  padding: 15px 5px;
  background-color: ${props => props.backgroundColor ?? props.theme.colors.backgroundAccentColor};
`
const FeedbackButtons = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 10px;
`
const HelpfulText = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
  align-self: center;
`
const FeedbackTouchableOpacity = styled(TouchableOpacity)`
  align-items: center;
`
const FeedbackText = styled(Text)`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
  font-size: 12px;
  margin-top: -2px;
`
const ICON_SIZE = 50
const Circle = styled(View)`
  margin-top: 9px;
  margin-bottom: 5px;
  border-radius: ${ICON_SIZE}px;
  height: ${ICON_SIZE}px;
  width: ${ICON_SIZE}px;
  align-items: center;
  justify-content: center;
`
const MAXIMAL_ICON_SIZE = ICON_SIZE / Math.sqrt(2)
const ICON_SCALE_FACTOR = 0.85
const Thumbnail = styled(SimpleImage)`
  height: ${MAXIMAL_ICON_SIZE * ICON_SCALE_FACTOR}px;
  width: ${MAXIMAL_ICON_SIZE * ICON_SCALE_FACTOR}px;
`

type SiteHelpfulBoxPropsType = {
  navigateToFeedback: (positive: boolean) => void
  backgroundColor?: string
  style?: StyleProp<ViewStyle>
}

const SiteHelpfulBox = ({ navigateToFeedback, backgroundColor, style }: SiteHelpfulBoxPropsType): ReactElement => {
  const { t } = useTranslation('feedback')
  return (
    <FeedbackBox style={style} backgroundColor={backgroundColor}>
      <HelpfulText>{t('isThisSiteUseful')}</HelpfulText>
      <FeedbackButtons>
        <FeedbackTouchableOpacity onPress={() => navigateToFeedback(true)}>
          <Circle>
            <Thumbnail source={happyIcon} />
          </Circle>
          <FeedbackText>{t('useful')}</FeedbackText>
        </FeedbackTouchableOpacity>
        <FeedbackTouchableOpacity onPress={() => navigateToFeedback(false)}>
          <Circle>
            <Thumbnail source={sadIcon} />
          </Circle>
          <FeedbackText>{t('notUseful')}</FeedbackText>
        </FeedbackTouchableOpacity>
      </FeedbackButtons>
    </FeedbackBox>
  )
}

export default SiteHelpfulBox
