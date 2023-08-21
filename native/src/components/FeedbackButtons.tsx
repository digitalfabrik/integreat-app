import SadIcon from 'integreat-app/assets/icons/negative-feedback.svg'
import HappyIcon from 'integreat-app/assets/icons/positive-feedback.svg'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import TextButton from './TextButton'
import Pressable from './base/Pressable'

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
      <TextButton
        type='tile'
        text={t('useful')}
        onPress={() => setIsPositiveFeedback(isPositiveFeedback !== true ? true : null)}
        Icon={<HappyIcon height={MAXIMAL_ICON_SIZE} width={MAXIMAL_ICON_SIZE} />}
        active={isPositiveFeedback === true}
      />
      <Spacing />
      <TextButton
        type='tile'
        text={t('notUseful')}
        onPress={() => setIsPositiveFeedback(isPositiveFeedback !== false ? false : null)}
        Icon={<SadIcon height={MAXIMAL_ICON_SIZE} width={MAXIMAL_ICON_SIZE} />}
        active={isPositiveFeedback === false}
      />
    </Container>
  )
}

export default FeedbackButtons
