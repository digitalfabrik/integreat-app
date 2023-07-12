import SadIcon from 'integreat-app/assets/icons/negative-feedback.svg'
import HappyIcon from 'integreat-app/assets/icons/positive-feedback.svg'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import Text from './base/Text'

const Container = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 12px 0;
`

const FeedbackTouchableOpacity = styled(TouchableOpacity)`
  align-items: center;
  border-radius: 18px;
  width: 100px;
  height: 80px;

  justify-content: center;
`
const CardShadow = styled.View<{ $active: boolean | null }>`
  background-color: ${props => (props.$active ? `${props.theme.colors.themeColor}` : 'white')};
  border-radius: 18px;
  shadow-color: #171717;
  shadow-offset: 1px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3px;
`

const FeedbackText = styled(Text)`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontRegular};
  font-size: 12px;
  margin-top: 8px;
`
const Spacing = styled.View`
  padding: 10px;
`

const ICON_SIZE = 50

const MAXIMAL_ICON_SIZE = ICON_SIZE / Math.sqrt(2)
const ICON_SCALE_FACTOR = 0.85

type FeedbackButtonsProps = {
  isPositiveFeedback: boolean | null
  setIsPositiveFeedback: (isPositive: boolean | null) => void
}

const FeedbackButtons = ({ isPositiveFeedback, setIsPositiveFeedback }: FeedbackButtonsProps): ReactElement => {
  const { t } = useTranslation('feedback')
  return (
    <Container>
      <CardShadow $active={isPositiveFeedback}>
        <FeedbackTouchableOpacity
          onPress={() => setIsPositiveFeedback(isPositiveFeedback !== true ? true : null)}
          testID='feedback-positive-rating'>
          <HappyIcon height={MAXIMAL_ICON_SIZE * ICON_SCALE_FACTOR} width={MAXIMAL_ICON_SIZE * ICON_SCALE_FACTOR} />
          <FeedbackText>{t('useful')}</FeedbackText>
        </FeedbackTouchableOpacity>
      </CardShadow>
      <Spacing />
      <CardShadow $active={isPositiveFeedback === false}>
        <FeedbackTouchableOpacity
          onPress={() => setIsPositiveFeedback(isPositiveFeedback !== false ? false : null)}
          testID='feedback-negative-rating'>
          <SadIcon height={MAXIMAL_ICON_SIZE * ICON_SCALE_FACTOR} width={MAXIMAL_ICON_SIZE * ICON_SCALE_FACTOR} />
          <FeedbackText>{t('notUseful')}</FeedbackText>
        </FeedbackTouchableOpacity>
      </CardShadow>
    </Container>
  )
}

export default FeedbackButtons
