import styled from '@emotion/styled'
import SentimentDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentDissatisfiedOutlined'
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined'
import { ToggleButtonGroup } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import ToggleButton from './base/ToggleButton'

const StyledToggleButtonGroup = styled(ToggleButtonGroup)`
  display: flex;
  justify-content: center;
  gap: 16px;
`

type FeedbackButtonsProps = {
  isPositive: boolean | null
  onRatingChange: (isPositive: boolean | null) => void
}

const FeedbackButtons = ({ isPositive, onRatingChange }: FeedbackButtonsProps): ReactElement => {
  const { t } = useTranslation('feedback')

  const handleChange = (event: React.MouseEvent<HTMLElement>, newValue: string | null) => {
    if (newValue === t('useful')) {
      onRatingChange(isPositive === true ? null : true)
    } else if (newValue === t('notUseful')) {
      onRatingChange(isPositive === false ? null : false)
    }
  }

  const currentValue = () => {
    if (isPositive === null) {
      return null
    }
    if (isPositive) {
      return t('useful')
    }
    return t('notUseful')
  }

  return (
    <>
      <div>{t('description')}</div>
      <StyledToggleButtonGroup exclusive value={currentValue()} onChange={handleChange}>
        <ToggleButton icon={SentimentSatisfiedOutlinedIcon} text={t('useful')} />
        <ToggleButton icon={SentimentDissatisfiedOutlinedIcon} text={t('notUseful')} />
      </StyledToggleButtonGroup>
    </>
  )
}

export default FeedbackButtons
