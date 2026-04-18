import { styled } from '@mui/material/styles'
import React, { ReactElement, useEffect, useState } from 'react'

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
const LiveAnnouncer = ({ message }: LiveAnnouncerProps): ReactElement => {
  const [announced, setAnnounced] = useState('')

  useEffect(() => {
    if (!message) {
      return
    }

    setAnnounced('')
    setAnnounced(message)
  }, [message])

  return (
    <VisuallyHidden role='status' aria-live='polite' aria-atomic='true'>
      {announced}
    </VisuallyHidden>
  )
}

export default LiveAnnouncer
