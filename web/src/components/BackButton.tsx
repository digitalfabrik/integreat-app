import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { DirectionDependentBackIcon } from './base/DirectionDependentIcons'

const StyledButton = styled(Button)({
  textTransform: 'none',
  alignSelf: 'flex-start',
})

type BackButtonProps = {
  fallback?: string
}

const BackButton = ({ fallback }: BackButtonProps): ReactElement | null => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const currentHistoryIndex = window.history.state?.idx ?? 0
  // Initial history index to account for language changes or other user interactions on this page.
  const [initialHistoryIndex] = useState(currentHistoryIndex)
  const hasHistory = initialHistoryIndex !== 0

  if (!hasHistory && !fallback) {
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
