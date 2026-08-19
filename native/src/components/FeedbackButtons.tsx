import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components/native'

import { Rating, RATING_NEGATIVE, RATING_POSITIVE } from 'shared'

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
  rating: Rating | null
  setRating: (rating: Rating | null) => void
}

const FeedbackButtons = ({ rating, setRating }: FeedbackButtonsProps): ReactElement => {
  const { t } = useTranslation(['feedback'])
  const theme = useTheme()
  const iconColor = (value: Rating) =>
    value === rating && theme.dark ? theme.colors.background : theme.colors.onSurfaceVariant

  return (
    <Container>
      <ToggleButton
        text={t($ => $.useful)}
        onPress={() => setRating(rating !== RATING_POSITIVE ? RATING_POSITIVE : null)}
        icon={<Icon size={32} color={iconColor(RATING_POSITIVE)} source='emoticon-happy-outline' />}
        active={rating === RATING_POSITIVE}
      />
      <Spacing />
      <ToggleButton
        text={t($ => $.notUseful)}
        onPress={() => setRating(rating !== RATING_NEGATIVE ? RATING_NEGATIVE : null)}
        icon={<Icon size={32} color={iconColor(RATING_NEGATIVE)} source='emoticon-sad-outline' />}
        active={rating === RATING_NEGATIVE}
      />
    </Container>
  )
}

export default FeedbackButtons
