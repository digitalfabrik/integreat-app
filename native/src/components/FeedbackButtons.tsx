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
  feedbackRating: boolean | null
  setFeedbackRating: (isPositive: boolean | null) => void
}

const FeedbackButtons = ({ feedbackRating, setFeedbackRating }: FeedbackButtonsProps): ReactElement => {
  const { t } = useTranslation('feedback')
  const theme = useTheme()
  const iconColor = (value: boolean) =>
    feedbackRating === value && theme.dark ? theme.colors.background : theme.colors.onSurfaceVariant

  return (
    <Container>
      <ToggleButton
        text={t('useful')}
        onPress={() => setFeedbackRating(feedbackRating !== true ? true : null)}
        icon={<Icon size={32} color={iconColor(true)} source='emoticon-happy-outline' />}
        active={feedbackRating === true}
      />
      <Spacing />
      <ToggleButton
        text={t('notUseful')}
        onPress={() => setFeedbackRating(feedbackRating !== false ? false : null)}
        icon={<Icon size={32} color={iconColor(false)} source='emoticon-sad-outline' />}
        active={feedbackRating === false}
      />
    </Container>
  )
}

export default FeedbackButtons
