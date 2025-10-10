import SentimentDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentDissatisfiedOutlined'
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { Rating, RATING_NEGATIVE, RATING_POSITIVE } from 'shared'

import SpacedToggleButtonGroup from './SpacedToggleButtonGroup'
import ToggleButton from './base/ToggleButton'

const StyledToggleButtonGroup = styled(SpacedToggleButtonGroup)`
  display: flex;
  justify-content: center;
  gap: 16px;
`

type FeedbackButtonsProps = {
  rating: Rating | null
  setRating: (isPositive: Rating | null) => void
}

const FeedbackButtons = ({ rating, setRating }: FeedbackButtonsProps): ReactElement => {
  const { t } = useTranslation('feedback')

  const handleChange = (_: React.MouseEvent<HTMLElement>, newValue: Rating | null) => setRating(newValue)

  return (
    <Stack gap={2}>
      <Typography variant='body2'>{t('description')}</Typography>
      <StyledToggleButtonGroup exclusive value={rating} onChange={handleChange}>
        <ToggleButton value={RATING_POSITIVE} icon={SentimentSatisfiedOutlinedIcon} text={t('useful')} />
        <ToggleButton value={RATING_NEGATIVE} icon={SentimentDissatisfiedOutlinedIcon} text={t('notUseful')} />
      </StyledToggleButtonGroup>
    </Stack>
  )
}

export default FeedbackButtons
