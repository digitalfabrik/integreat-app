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

type PlacePanelNavigationProps = {
  switchPlace: (step: 1 | -1) => void
}

const PlacePanelNavigation = ({ switchPlace }: PlacePanelNavigationProps): ReactElement => {
  const { t } = useTranslation('places')
  return (
    <Stack direction='row' justifyContent='space-between' padding={1}>
      <StyledButton
        onClick={() => switchPlace(-1)}
        startIcon={<DirectionDependentBackIcon />}
        tabIndex={0}
        color='inherit'
        aria-label={t('previousPlace')}>
        {t('detailsPreviousPlace')}
      </StyledButton>
      <StyledButton
        onClick={() => switchPlace(1)}
        endIcon={<DirectionDependentNextIcon />}
        tabIndex={0}
        color='inherit'
        aria-label={t('nextPlace')}>
        {t('detailsNextPlace')}
      </StyledButton>
    </Stack>
  )
}

export default PlacePanelNavigation
