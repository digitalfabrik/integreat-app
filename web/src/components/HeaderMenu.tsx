import CheckIcon from '@mui/icons-material/Check'
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined'
import LinkIcon from '@mui/icons-material/Link'
import MailOutlinedIcon from '@mui/icons-material/MailOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import ShareIcon from '@mui/icons-material/ShareOutlined'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Grow from '@mui/material/Grow'
import IconButton from '@mui/material/IconButton'
import MenuList from '@mui/material/MenuList'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import { styled } from '@mui/material/styles'
import React, { ReactElement, RefObject, useImperativeHandle } from 'react'
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

const MenuPaper = styled(Paper)`
  margin-top: 8px;
  min-height: 0;
  height: max-content;
  border-radius: 8px;
`

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
  const anchorRef = React.useRef<HTMLButtonElement>(null)
  const paperRef = React.useRef<HTMLDivElement>(null)
  const [open, setOpen] = React.useState<boolean>(false)
  const [expandedAccordion, setExpandedAccordion] = React.useState<'share' | 'legal' | null>(null)
  const [urlCopied, setUrlCopied] = React.useState<boolean>(false)
  const [qrShareOpen, setQrShareOpen] = React.useState<boolean>(false)
  const { regionCode, languageCode } = useRouteParams()
  const { mobile } = useDimensions()
  const { t } = useTranslation()

  const toggleMenu = () => setOpen(previous => !previous)

  const closeMenu = () => {
    const active = document.activeElement
    if (!active || active === document.body || paperRef.current?.contains(active)) {
      anchorRef.current?.focus()
    }
    setOpen(false)
  }

  useImperativeHandle(ref, () => ({ closeMenu }))

  const handleClickAway = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current?.contains(event.target as Node)) {
      return
    }
    closeMenu()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      closeMenu()
    }
  }

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget as Node | null
    if (next && !event.currentTarget.contains(next) && !anchorRef.current?.contains(next)) {
      setOpen(false)
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
        placement='bottom-end'
        transition
        disablePortal
        sx={{ zIndex: theme => theme.zIndex.appBar + 1 }}>
        {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <MenuPaper ref={paperRef} id={HEADER_MENU_PANEL_ELEMENT_ID} elevation={8} onBlur={handleBlur}>
              <ClickAwayListener onClickAway={handleClickAway}>
                <MenuList id='header-menu' autoFocusItem={open} disabledItemsFocusable onKeyDown={handleKeyDown}>
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
