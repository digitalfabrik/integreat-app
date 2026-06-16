import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import useDimensions from '../hooks/useDimensions'
import { DirectionDependentBackIcon } from './base/Dialog'

const StyledButton = styled(Button)({
  textTransform: 'none',
  alignSelf: 'flex-start',
})

const historyIndex = (): number => window.history.state?.idx ?? 0

const BackToContentButton = (): ReactElement | null => {
  const navigate = useNavigate()
  const { mobile } = useDimensions()
  const { t } = useTranslation('layout')

  // Index of the content page we arrived from so that we can navigate back even if the language changed.
  const entryIndex = useRef(historyIndex()).current

  if (!mobile || entryIndex === 0) {
    return null
  }

  return (
    <StyledButton
      onClick={() => navigate(entryIndex - historyIndex() - 1)}
      startIcon={<DirectionDependentBackIcon />}
      color='inherit'
      aria-label={t('backToContent')}>
      {t('backToContent')}
    </StyledButton>
  )
}

export default BackToContentButton
