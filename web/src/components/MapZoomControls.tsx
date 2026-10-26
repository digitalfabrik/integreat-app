import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { MapViewRef } from './MapView'

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.background.accent,
  border: `1px solid ${theme.palette.tertiary.light}`,

  ':hover': {
    backgroundColor: theme.palette.background.default,
  },

  [theme.breakpoints.down('md')]: {
    right: -100,

    ':focus': {
      right: 0,
    },
  },
}))

type MapZoomControlsProps = {
  mapViewRef: MapViewRef
}

const MapZoomControls = ({ mapViewRef }: MapZoomControlsProps): ReactElement => {
  const { t } = useTranslation()

  return (
    <Stack sx={{ gap: 1 }}>
      <StyledIconButton onClick={mapViewRef.zoomIn} aria-label={t($ => $.places.zoom.in)}>
        <AddIcon />
      </StyledIconButton>
      <StyledIconButton onClick={mapViewRef.zoomOut} aria-label={t($ => $.places.zoom.out)}>
        <RemoveIcon />
      </StyledIconButton>
    </Stack>
  )
}

export default MapZoomControls
