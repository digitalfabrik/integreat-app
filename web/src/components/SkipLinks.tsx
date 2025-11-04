import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'
import Backdrop from '@mui/material/Backdrop'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { MAIN_ELEMENT_ID } from '../constants'

const SkipLink = styled(Button)`
  position: fixed;
  display: flex;
  left: 20px;
  top: 50px;
  gap: 8px;
  background-color: ${props => props.theme.palette.background.paper};
  opacity: 0;
  z-index: -1;
  transition:
    top 0.2s,
    opacity 0.2s;

  &:focus {
    top: 20px;
    opacity: 1;
    z-index: 10000;
    outline: 2px solid ${props => props.theme.palette.primary.main} !important;
  }
`

const SkipLinks = (): ReactElement => {
  const { t } = useTranslation('layout')
  const [backdropOpen, setBackdropOpen] = useState(false)

  return (
    <>
      <Backdrop open={backdropOpen} style={{ zIndex: 9999 }} />
      <div aria-label='Skip links'>
        <SkipLink
          disableFocusRipple
          href={`#${MAIN_ELEMENT_ID}`}
          onFocus={() => setBackdropOpen(true)}
          onBlur={() => setBackdropOpen(false)}>
          {t('skipToContent')}
          <Chip label='ENTER' color='primary' icon={<KeyboardReturnIcon />} size='small' />
        </SkipLink>
      </div>
    </>
  )
}

export default SkipLinks
