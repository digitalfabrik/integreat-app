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

const ICON_SIZE = 50
const ICON_SCALE_FACTOR = 0.85
const MAXIMAL_ICON_SIZE = (ICON_SIZE / Math.sqrt(2)) * ICON_SCALE_FACTOR

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
        Icon={<Icon Icon={HappySmileyIcon} height={MAXIMAL_ICON_SIZE} width={MAXIMAL_ICON_SIZE} />}
        active={isPositiveFeedback === true}
      />
      <Spacing />
      <ToggleButton
        text={t('notUseful')}
        onPress={() => setIsPositiveFeedback(isPositiveFeedback !== false ? false : null)}
        Icon={<Icon Icon={SadSmileyIcon} height={MAXIMAL_ICON_SIZE} width={MAXIMAL_ICON_SIZE} />}
        active={isPositiveFeedback === false}
      />
    </Container>
  )
}

export default FeedbackButtons
