import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components/native'

import Icon from './base/Icon'
import ToggleButton from './base/ToggleButton'

const Container = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 12px 0;
`

const Spacing = styled.View`
  padding: 10px;
`

type FeedbackButtonsProps = {
  isPositiveFeedback: boolean | null
  setIsPositiveFeedback: (isPositive: boolean | null) => void
}

const FeedbackButtons = ({ isPositiveFeedback, setIsPositiveFeedback }: FeedbackButtonsProps): ReactElement => {
  const { t } = useTranslation('feedback')
  const theme = useTheme()
  const iconColor = (value: boolean) =>
    isPositiveFeedback === value && theme.legacy.isContrastTheme
      ? theme.colors.background
      : theme.colors.onSurfaceVariant

  return (
    <Container>
      <ToggleButton
        text={t('useful')}
        onPress={() => setIsPositiveFeedback(isPositiveFeedback !== true ? true : null)}
        Icon={<Icon size={32} color={iconColor(true)} source='emoticon-happy-outline' />}
        active={isPositiveFeedback === true}
      />
      <Spacing />
      <ToggleButton
        text={t('notUseful')}
        onPress={() => setIsPositiveFeedback(isPositiveFeedback !== false ? false : null)}
        Icon={<Icon size={32} color={iconColor(false)} source='emoticon-sad-outline' />}
        active={isPositiveFeedback === false}
      />
    </Container>
  )
}

export default FeedbackButtons
