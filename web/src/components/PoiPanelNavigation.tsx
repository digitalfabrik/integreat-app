import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { DirectionDependentBackIcon } from './base/Dialog'

const DirectionDependentNextIcon = styled(ArrowBackIcon)(({ theme }) => ({
  transform: theme.direction === 'ltr' ? 'scaleX(-1)' : 'none',
}))

const StyledButton = styled(Button)({
  textTransform: 'none',
})

type PoiPanelNavigationProps = {
  switchPoi: (step: 1 | -1) => void
}

const PoiPanelNavigation = ({ switchPoi }: PoiPanelNavigationProps): ReactElement => {
  const { t } = useTranslation('pois')
  return (
    <Stack direction='row' justifyContent='space-between' padding={1}>
      <StyledButton
        onClick={() => switchPoi(-1)}
        startIcon={<DirectionDependentBackIcon />}
        tabIndex={0}
        color='inherit'
        aria-label={t('previous')}>
        {t('detailsPreviousPoi')}
      </StyledButton>
      <StyledButton
        onClick={() => switchPoi(1)}
        endIcon={<DirectionDependentNextIcon />}
        tabIndex={0}
        color='inherit'
        aria-label={t('nextPoi')}>
        {t('detailsNextPoi')}
      </StyledButton>
    </Stack>
  )
}

export default PoiPanelNavigation
