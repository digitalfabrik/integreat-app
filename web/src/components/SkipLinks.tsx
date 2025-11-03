import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'
import Backdrop from '@mui/material/Backdrop'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { POIS_ROUTE } from 'shared'

import {
  BOTTOM_NAVIGATION_ELEMENT_ID,
  FOOTER_ELEMENT_ID,
  MAIN_ELEMENT_ID,
  NAVIGATION_TABS_ELEMENT_ID,
} from '../constants'
import useCityContentParams from '../hooks/useCityContentParams'
import useDimensions from '../hooks/useDimensions'

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
  }
`

const SkipLinks = (): ReactElement => {
  const { t } = useTranslation('layout')
  const { desktop } = useDimensions()
  const { route } = useCityContentParams()
  const [backdropOpen, setBackdropOpen] = useState(false)

  const showSkipToFooter = desktop && route !== POIS_ROUTE

  const skipLinks = [
    { title: t('skipToContent'), href: `#${MAIN_ELEMENT_ID}` },
    { title: t('skipToNavigation'), href: `#${desktop ? NAVIGATION_TABS_ELEMENT_ID : BOTTOM_NAVIGATION_ELEMENT_ID}` },
    ...(showSkipToFooter ? [{ title: t('skipToFooter'), href: `#${FOOTER_ELEMENT_ID}` }] : []),
  ]

  return (
    <>
      <Backdrop open={backdropOpen} style={{ zIndex: 9999 }} />
      <div aria-label='Skip links'>
        {skipLinks.map(link => (
          <SkipLink
            disableFocusRipple
            key={link.href}
            href={link.href}
            onFocus={() => setBackdropOpen(true)}
            onBlur={() => setBackdropOpen(false)}>
            {link.title}
            <Chip label='ENTER' color='primary' icon={<KeyboardReturnIcon />} size='small' />
          </SkipLink>
        ))}
      </div>
    </>
  )
}

export default SkipLinks
