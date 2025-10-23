import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'
import Backdrop from '@mui/material/Backdrop'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CATEGORIES_ROUTE, POIS_ROUTE } from 'shared'

import useCityContentParams from '../hooks/useCityContentParams'
import useDimensions from '../hooks/useDimensions'

const SkipLink = styled(Link)`
  position: fixed;
  display: flex;
  left: 20px;
  top: 50px;
  padding: 8px 16px;
  gap: 8px;
  border-radius: 48px;
  color: ${props => props.theme.palette.text.primary};
  background-color: ${props => props.theme.palette.background.paper};
  border: 4px solid ${props => props.theme.palette.primary.main};
  box-shadow: ${props => props.theme.shadows[4]};
  opacity: 0;
  z-index: -1;
  pointer-events: none;
  transition:
    top 0.2s ease,
    opacity 0.2s ease;
  text-decoration: none;
  align-items: center;

  &:focus {
    top: 20px;
    opacity: 1;
    z-index: 10000;
    outline: none !important;
  }
`

const EnterBadge = styled(Typography)`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 48px;
  background-color: ${props => props.theme.palette.primary.main};
  color: ${props => props.theme.palette.primary.contrastText};
`
const SkipLinks = (): ReactElement => {
  const { t } = useTranslation('layout')
  const { mobile } = useDimensions()
  const { route } = useCityContentParams()
  const [backdropOpen, setBackdropOpen] = useState(false)

  const showSkipToFooter = mobile || route !== POIS_ROUTE
  const hrefTargetForContent = route === CATEGORIES_ROUTE ? '#content' : '#main'

  const skipLinks = [
    { title: t('skipToContent'), href: hrefTargetForContent },
    { title: t('skipToMenu'), href: '#city-content-menu' },
    ...(showSkipToFooter
      ? [{ title: mobile ? t('skipToBottomNav') : t('skipToFooter'), href: mobile ? '#bottom-navigation' : '#footer' }]
      : []),
  ]

  return (
    <>
      <Backdrop open={backdropOpen} style={{ zIndex: 9999 }} />
      <div aria-label='Skip links'>
        {skipLinks.map(link => (
          <SkipLink
            key={link.href}
            href={link.href}
            onFocus={() => setBackdropOpen(true)}
            onBlur={() => setBackdropOpen(false)}>
            {link.title}
            <EnterBadge variant='body3'>
              <KeyboardReturnIcon fontSize='inherit' />
              ENTER
            </EnterBadge>
          </SkipLink>
        ))}
      </div>
    </>
  )
}

export default SkipLinks
