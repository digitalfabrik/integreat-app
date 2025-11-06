import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'
import Backdrop from '@mui/material/Backdrop'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { MAIN_ELEMENT_ID } from './Layout'

const StyledButton = styled(Button)`
  position: fixed;
  left: 16px;
  top: 48px;
  gap: 8px;
  background-color: ${props => props.theme.palette.background.paper};
  z-index: -1;
  transition: top 0.2s;

  :focus {
    top: 20px;
    z-index: 10000;
    outline: 2px solid ${props => props.theme.palette.primary.main} !important;
  }
`

const SkipToContent = (): ReactElement => {
  const { t } = useTranslation('layout')
  const [backdropOpen, setBackdropOpen] = useState(false)

  return (
    <>
      <Backdrop open={backdropOpen} style={{ zIndex: 9999 }} />
      <StyledButton
        disableFocusRipple
        href={`#${MAIN_ELEMENT_ID}`}
        onFocus={() => setBackdropOpen(true)}
        onBlur={() => setBackdropOpen(false)}>
        {t('skipToContent')}
        <Chip label='ENTER' color='primary' icon={<KeyboardReturnIcon />} size='small' />
      </StyledButton>
    </>
  )
}

export default SkipToContent
