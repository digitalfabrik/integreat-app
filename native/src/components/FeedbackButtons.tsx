import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { HappySmileyIcon, SadSmileyIcon } from '../assets'
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

const StyledIcon = styled(Icon)<{ active: boolean }>`
  color: ${props =>
    props.active && props.theme.legacy.isContrastTheme
      ? props.theme.legacy.colors.backgroundColor
      : props.theme.legacy.colors.textSecondaryColor};
  width: 32px;
  height: 32px;
`

type FeedbackButtonsProps = {
  isPositiveFeedback: boolean | null
  setIsPositiveFeedback: (isPositive: boolean | null) => void
}

const FeedbackButtons = ({ isPositiveFeedback, setIsPositiveFeedback }: FeedbackButtonsProps): ReactElement => {
  const { t } = useTranslation('feedback')
  return (
    <Container>
      <ToggleButton
        text={t('useful')}
        onPress={() => setIsPositiveFeedback(isPositiveFeedback !== true ? true : null)}
        Icon={<StyledIcon active={isPositiveFeedback === true} Icon={HappySmileyIcon} />}
        active={isPositiveFeedback === true}
      />
      <Spacing />
      <ToggleButton
        text={t('notUseful')}
        onPress={() => setIsPositiveFeedback(isPositiveFeedback !== false ? false : null)}
        Icon={<StyledIcon active={isPositiveFeedback === false} Icon={SadSmileyIcon} />}
        active={isPositiveFeedback === false}
      />
    </Container>
  )
}

export default FeedbackButtons
