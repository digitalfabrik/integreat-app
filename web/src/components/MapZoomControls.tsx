import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

const StyledIconButton = styled(IconButton)`
  background-color: ${props => props.theme.palette.background.accent};
  border: 1px solid
    ${props => (props.theme.isContrastTheme ? props.theme.palette.grey[700] : props.theme.palette.grey[400])};

  :hover {
    background-color: ${props => props.theme.palette.background.default};
  }

  ${props => props.theme.breakpoints.down('md')} {
    inset-inline-end: -100px;

    :focus {
      inset-inline-end: 0;
    }
  }
`

type MapZoomControlsProps = {
  onZoomIn: () => void
  onZoomOut: () => void
}

const MapZoomControls = ({ onZoomIn, onZoomOut }: MapZoomControlsProps): ReactElement => {
  const { t } = useTranslation('pois')

  return (
    <Stack gap={1}>
      <StyledIconButton onClick={onZoomIn} aria-label={t('zoomIn')}>
        <AddIcon />
      </StyledIconButton>
      <StyledIconButton onClick={onZoomOut} aria-label={t('zoomOut')}>
        <RemoveIcon />
      </StyledIconButton>
    </Stack>
  )
}

export default MapZoomControls
