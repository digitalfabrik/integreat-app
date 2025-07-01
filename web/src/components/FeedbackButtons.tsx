import styled from '@emotion/styled'
import SentimentDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentDissatisfiedOutlined'
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import ToggleButton from './base/ToggleButton'

const ButtonContainer = styled.div`
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
  return (
    <>
      <div>{t('description')}</div>
      <ButtonContainer>
        <ToggleButton
          onClick={() => onRatingChange(isPositive ? null : true)}
          active={isPositive === true}
          icon={SentimentSatisfiedOutlinedIcon}
          text={t('useful')}
        />
        <ToggleButton
          onClick={() => onRatingChange(isPositive === false ? null : false)}
          active={isPositive === false}
          icon={SentimentDissatisfiedOutlinedIcon}
          text={t('notUseful')}
        />
      </ButtonContainer>
    </>
  )
}

export default FeedbackButtons
