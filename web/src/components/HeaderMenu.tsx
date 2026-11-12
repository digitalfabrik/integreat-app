import CheckIcon from '@mui/icons-material/Check'
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined'
import LinkIcon from '@mui/icons-material/Link'
import MailOutlinedIcon from '@mui/icons-material/MailOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import ShareIcon from '@mui/icons-material/ShareOutlined'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import { dividerClasses } from '@mui/material/Divider'
import Grow from '@mui/material/Grow'
import IconButton from '@mui/material/IconButton'
import MenuList from '@mui/material/MenuList'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import { styled } from '@mui/material/styles'
import React, { KeyboardEvent, ReactElement, RefObject, useImperativeHandle, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import buildConfig from '../constants/buildConfig'
import { HEADER_MENU_ELEMENT_ID, HEADER_MENU_PANEL_ELEMENT_ID } from '../constants/layout'
import useDimensions from '../hooks/useDimensions'
import { useRouteParams } from '../hooks/useRegionContentParams'
import { withDividers } from '../utils'
import getFooterLinks from '../utils/getFooterLinks'
import { captureError } from '../utils/sentry'
import MenuAccordion from './MenuAccordion'
import MenuItem from './MenuItem'
import QrCodeDialog from './QrCodeDialog'

const COPY_TIMEOUT = 3000

// Not using MUI Menu, since its modal hides the rest of the page from screen readers, trapping e.g. TalkBack users
const MenuPaper = styled(Paper)({
  marginTop: 8,
  borderRadius: 16,
  maxHeight: 'calc(100vh - 96px)',
  overflowY: 'auto',

  [`& .${dividerClasses.root}`]: {
    margin: '0 !important',
  },
})

export type MenuRef = {
  closeMenu: () => void
}

type HeaderMenuProps = {
  children: (ReactElement | null)[] | ReactElement
  pageTitle: string | null
  fitScreen?: boolean
  ref?: RefObject<MenuRef | null>
}

const HeaderMenu = ({ children, pageTitle, fitScreen, ref }: HeaderMenuProps): ReactElement => {
  // Use a separate boolean instead of setting the ref to null, otherwise the menu jumps to the top left during the exit transition
  const [open, setOpen] = useState<boolean>(false)
  const [expandedAccordion, setExpandedAccordion] = useState<'share' | 'legal' | null>(null)
  const [urlCopied, setUrlCopied] = useState<boolean>(false)
  const [qrShareOpen, setQrShareOpen] = useState<boolean>(false)
  const { regionCode, languageCode } = useRouteParams()
  const { mobile } = useDimensions()
  const anchorRef = useRef<HTMLButtonElement>(null)
  const { t } = useTranslation()

  const closeMenu = () => {
    anchorRef.current?.focus()
    setOpen(false)
  }

  useImperativeHandle(ref, () => ({ closeMenu }))

  const toggleMenu = () => setOpen(!open)

  const handleClickAway = (event: MouseEvent | TouchEvent) => {
    // Clicks on the menu button are handled by toggleMenu, otherwise a tap would directly reopen it
    if (!anchorRef.current?.contains(event.target as Node)) {
      setOpen(false)
    }
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' || event.key === 'Tab') {
      closeMenu()
    }
  }

  const items = Array.isArray(children) ? children : [children]

  const shareUrl = window.location.href
  const encodedShareUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(pageTitle ?? buildConfig().appName)
  const shareMessage = t($ => $.share.message, { message: encodedTitle })

  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareMessage}%0a${encodedShareUrl}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}&t${shareMessage}`
  const mailUrl = `mailto:?subject=${encodedTitle}&body=${shareMessage}&t${encodedShareUrl}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).catch(captureError)
    setUrlCopied(true)
    setTimeout(() => setUrlCopied(false), COPY_TIMEOUT)
  }

  const sharingItems = [
    <MenuItem
      key='whatsapp'
      to={whatsappUrl}
      text='WhatsApp'
      icon={<WhatsAppIcon fontSize='small' />}
      closeMenu={closeMenu}
    />,
    <MenuItem
      key='facebook'
      to={facebookUrl}
      text='Facebook'
      icon={<FacebookOutlinedIcon fontSize='small' />}
      closeMenu={closeMenu}
    />,
    <MenuItem
      key='email'
      to={mailUrl}
      text={t($ => $.common.contacts.email)}
      icon={<MailOutlinedIcon fontSize='small' />}
      closeMenu={closeMenu}
    />,
    <MenuItem
      key='qr'
      text={t($ => $.share.qr.label)}
      icon={<QrCode2Icon fontSize='small' />}
      onClick={() => setQrShareOpen(true)}
      closeMenu={closeMenu}
    />,
  ]

  const legalItems = getFooterLinks({ languageCode, regionCode, t }).map(({ text, to }) => (
    <MenuItem key={text} text={text} to={to} closeMenu={closeMenu} />
  ))

  return (
    <>
      <IconButton
        ref={anchorRef}
        id={HEADER_MENU_ELEMENT_ID}
        onClick={toggleMenu}
        aria-label={t($ => $.common.labels.menu)}
        aria-expanded={open}
        aria-haspopup='menu'
        aria-controls={open ? 'header-menu' : undefined}>
        <MoreVertIcon />
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement='bottom-start'
        transition
        sx={{ zIndex: theme => theme.zIndex.appBar + 1 }}>
        {({ TransitionProps: transitionProps }) => (
          <Grow
            {...transitionProps}
            // Let the tour measure the menu once it is opened and positioned
            onEntered={() => window.dispatchEvent(new Event('resize'))}>
            <MenuPaper id={HEADER_MENU_PANEL_ELEMENT_ID} elevation={8}>
              <ClickAwayListener onClickAway={handleClickAway}>
                <MenuList id='header-menu' autoFocusItem={open} onKeyDown={handleKeyDown}>
                  {withDividers([
                    ...items,
                    <MenuItem
                      key='copy'
                      text={t($ => (urlCopied ? $.common.state.copied : $.share.copyLink))}
                      onClick={copyToClipboard}
                      icon={urlCopied ? <CheckIcon fontSize='small' /> : <LinkIcon fontSize='small' />}
                    />,
                    <MenuAccordion
                      key='share'
                      title={t($ => $.share.title)}
                      items={sharingItems}
                      icon={<ShareIcon fontSize='small' />}
                      expanded={expandedAccordion === 'share'}
                      setExpanded={expanded => setExpandedAccordion(expanded ? 'share' : null)}
                    />,
                    mobile || fitScreen ? (
                      <MenuAccordion
                        key='legal'
                        title={t($ => $.about.legal)}
                        items={legalItems}
                        expanded={expandedAccordion === 'legal'}
                        setExpanded={expanded => setExpandedAccordion(expanded ? 'legal' : null)}
                      />
                    ) : null,
                  ])}
                </MenuList>
              </ClickAwayListener>
            </MenuPaper>
          </Grow>
        )}
      </Popper>
      <QrCodeDialog
        open={qrShareOpen}
        close={() => setQrShareOpen(false)}
        title={t($ => $.share.qr.title)}
        description={t($ => $.share.qr.description)}
        content={shareUrl}
      />
    </>
  )
}

export default HeaderMenu
