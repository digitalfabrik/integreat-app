import styled from '@emotion/styled'
import SentimentDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentDissatisfiedOutlined'
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined'
import { ToggleButtonGroup } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { Rating } from './FeedbackContainer'
import ToggleButton from './base/ToggleButton'

const StyledToggleButtonGroup = styled(ToggleButtonGroup)`
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

  const handleChange = (event: React.MouseEvent<HTMLElement>, newValue: Rating | null) => {
    setRating(newValue === rating ? null : newValue)
  }

  return (
    <>
      <div>{t('description')}</div>
      <StyledToggleButtonGroup exclusive value={rating} onChange={handleChange}>
        <ToggleButton value={'positive'} icon={SentimentSatisfiedOutlinedIcon} text={t('useful')} />
        <ToggleButton value={'negative'} icon={SentimentDissatisfiedOutlinedIcon} text={t('notUseful')} />
      </StyledToggleButtonGroup>
    </>
  )
}

export default FeedbackButtons
