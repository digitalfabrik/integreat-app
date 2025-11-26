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

const StyledIcon = styled(Icon)`
  width: 32px;
  height: 32px;
`

type FeedbackButtonsProps = {
  isPositiveFeedback: boolean | null
  setIsPositiveFeedback: (isPositive: boolean | null) => void
}

const FeedbackButtons = ({ isPositiveFeedback, setIsPositiveFeedback }: FeedbackButtonsProps): ReactElement => {
  const { t } = useTranslation('feedback')
  const theme = useTheme()
  const iconColor =
    isPositiveFeedback === true && theme.legacy.isContrastTheme
      ? theme.legacy.colors.backgroundColor
      : theme.legacy.colors.textSecondaryColor

  return (
    <Container>
      <ToggleButton
        text={t('useful')}
        onPress={() => setIsPositiveFeedback(isPositiveFeedback !== true ? true : null)}
        Icon={<StyledIcon size={32} color={iconColor} source='emoticon-happy-outline' />}
        active={isPositiveFeedback === true}
      />
      <Spacing />
      <ToggleButton
        text={t('notUseful')}
        onPress={() => setIsPositiveFeedback(isPositiveFeedback !== false ? false : null)}
        Icon={<StyledIcon size={32} color={iconColor} source='emoticon-sad-outline' />}
        active={isPositiveFeedback === false}
      />
    </Container>
  )
}

export default FeedbackButtons
