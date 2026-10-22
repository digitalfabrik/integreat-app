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

type BackButtonProps = {
  fallback?: string
  desktop?: boolean
}

const BackButton = ({ fallback, desktop = false }: BackButtonProps): ReactElement | null => {
  const navigate = useNavigate()
  const { mobile } = useDimensions()
  const { t } = useTranslation()

  const currentHistoryIndex = window.history.state?.idx ?? 0
  // Initial history index to account for language changes or other user interactions on this page.
  const [initialHistoryIndex] = useState(currentHistoryIndex)
  const hasHistory = initialHistoryIndex !== 0

  const visible = desktop || mobile
  const hasBack = hasHistory || !!fallback

  if (!visible || !hasBack) {
    return null
  }

  const onClick = () => {
    if (hasHistory) {
      navigate(initialHistoryIndex - currentHistoryIndex - 1)
    } else if (fallback) {
      navigate(fallback)
    }
  }

  return (
    <StyledButton onClick={onClick} startIcon={<DirectionDependentBackIcon />} color='inherit'>
      {t($ => $.common.actions.back)}
    </StyledButton>
  )
}

export default BackButton
