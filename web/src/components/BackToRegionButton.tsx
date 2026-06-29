import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import useDimensions from '../hooks/useDimensions'
import { DirectionDependentBackIcon } from './base/Dialog'

const StyledButton = styled(Button)({
  textTransform: 'none',
  alignSelf: 'flex-start',
})

const BackToRegionButton = (): ReactElement | null => {
  const navigate = useNavigate()
  const { mobile } = useDimensions()
  const { t } = useTranslation('common')
  const currentHistoryIndex = window.history.state?.idx ?? 0

  // Initial history index to account for language changes or other user interactions on this page.
  const [initialHistoryIndex] = useState(currentHistoryIndex)

  if (!mobile || initialHistoryIndex === 0) {
    return null
  }

  return (
    <StyledButton
      onClick={() => navigate(initialHistoryIndex - currentHistoryIndex - 1)}
      startIcon={<DirectionDependentBackIcon />}
      color='inherit'>
      {t('back')}
    </StyledButton>
  )
}

export default BackToRegionButton
