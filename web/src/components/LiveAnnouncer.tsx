import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

const VisuallyHidden = styled('div')(() => ({
  border: 0,
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: '1px',
  width: '1px',
  margin: 0,
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
}))

type LiveAnnouncerProps = {
  message: string
}
const LiveAnnouncer = ({ message }: LiveAnnouncerProps): ReactElement => (
  <VisuallyHidden role='status'>{message}</VisuallyHidden>
)

export default LiveAnnouncer
