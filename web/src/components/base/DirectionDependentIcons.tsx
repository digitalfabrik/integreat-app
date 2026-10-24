import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import SendIcon from '@mui/icons-material/Send'
import { styled, Theme } from '@mui/material/styles'

const mirrorInRtl = ({ theme }: { theme: Theme }) => ({
  transform: theme.direction === 'rtl' ? 'scaleX(-1)' : 'none',
})

export const DirectionDependentBackIcon = styled(ArrowBackIcon)(mirrorInRtl)

export const DirectionDependentForwardIcon = styled(ArrowForwardIcon)(mirrorInRtl)

export const DirectionDependentSendIcon = styled(SendIcon)(mirrorInRtl)
