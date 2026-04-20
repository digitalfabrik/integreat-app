import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

const VisuallyHidden = styled('div')(() => ({
  position: 'absolute',
  left: '-9999px',
  height: '1px',
  width: '1px',
  overflow: 'hidden',
}))

type LiveAnnouncerProps = {
  message: string
}
const LiveAnnouncer = ({ message }: LiveAnnouncerProps): ReactElement => (
  <VisuallyHidden role='status'>{message}</VisuallyHidden>
)

export default LiveAnnouncer
