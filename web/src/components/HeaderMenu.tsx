import CheckIcon from '@mui/icons-material/Check'
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined'
import LinkIcon from '@mui/icons-material/Link'
import MailOutlinedIcon from '@mui/icons-material/MailOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ShareIcon from '@mui/icons-material/ShareOutlined'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import { dividerClasses } from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import { styled } from '@mui/material/styles'
import React, { ReactElement, RefObject, useImperativeHandle } from 'react'
import { useTranslation } from 'react-i18next'

import buildConfig from '../constants/buildConfig'
import { useRouteParams } from '../hooks/useCityContentParams'
import useDimensions from '../hooks/useDimensions'
import { withDividers } from '../utils'
import getFooterLinks from '../utils/getFooterLinks'
import MenuAccordion from './MenuAccordion'
import MenuItem from './MenuItem'

const COPY_TIMEOUT = 3000

const StyledMenu = styled(MuiMenu)({
  marginTop: 8,

  [`& .${dividerClasses.root}`]: {
    margin: '0 !important',
  },
})

const NestedMenuItem = styled(MenuItem)({
  paddingInline: 8,
})

export type MenuRef = {
  closeMenu: () => void
}

type HeaderMenuProps = {
  children: (ReactElement | null)[] | ReactElement
  pageTitle: string | null
  ref?: RefObject<MenuRef | null>
}

const HeaderMenu = ({ children, pageTitle, ref }: HeaderMenuProps): ReactElement => {
  const [menuAnchorElement, setMenuAnchorElement] = React.useState<HTMLElement | null>(null)
  const [expandedAccordion, setExpandedAccordion] = React.useState<'share' | 'legal' | null>(null)
  const [urlCopied, setUrlCopied] = React.useState<boolean>(false)
  const { cityCode, languageCode } = useRouteParams()
  const { mobile } = useDimensions()
  const { t } = useTranslation('layout')

  useImperativeHandle(ref, () => ({ closeMenu: () => setMenuAnchorElement(null) }))

  const openMenu = (event: React.MouseEvent<HTMLElement>) => setMenuAnchorElement(event.currentTarget)
  const closeMenu = () => setMenuAnchorElement(null)
  const open = menuAnchorElement !== null

  const items = Array.isArray(children) ? children : [children]

  const shareUrl = window.location.href
  const encodedShareUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(pageTitle ?? buildConfig().appName)
  const shareMessage = t('shareMessage', { message: encodedTitle })

  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareMessage}%0a${encodedShareUrl}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}&t${shareMessage}`
  const mailUrl = `mailto:?subject=${encodedTitle}&body=${shareMessage}&t${encodedShareUrl}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).catch(reportError)
    setUrlCopied(true)
    setTimeout(() => setUrlCopied(false), COPY_TIMEOUT)
  }

  const sharingItems = [
    <NestedMenuItem
      key='whatsapp'
      to={whatsappUrl}
      text='WhatsApp'
      icon={<WhatsAppIcon fontSize='small' />}
      closeMenu={closeMenu}
    />,
    <NestedMenuItem
      key='facebook'
      to={facebookUrl}
      text='Facebook'
      icon={<FacebookOutlinedIcon fontSize='small' />}
      closeMenu={closeMenu}
    />,
    <NestedMenuItem
      key='email'
      to={mailUrl}
      text={t('common:email')}
      icon={<MailOutlinedIcon fontSize='small' />}
      closeMenu={closeMenu}
    />,
  ]

  const legalItems = getFooterLinks({ languageCode, cityCode }).map(({ text, to }) => (
    <NestedMenuItem key={text} text={t(text)} to={to} closeMenu={closeMenu} />
  ))

  return (
    <>
      <IconButton onClick={openMenu} aria-label={t('sideBarOpenAriaLabel')} aria-expanded={open}>
        <MoreVertIcon />
      </IconButton>
      <StyledMenu anchorEl={menuAnchorElement} open={open} onClose={closeMenu}>
        {withDividers([
          ...items,
          <MenuItem
            key='copy'
            text={t(urlCopied ? 'common:copied' : 'layout:copyUrl')}
            onClick={copyToClipboard}
            icon={urlCopied ? <CheckIcon fontSize='small' /> : <LinkIcon fontSize='small' />}
          />,
          <MenuAccordion
            key='share'
            title={t('share')}
            items={sharingItems}
            icon={<ShareIcon fontSize='small' />}
            expanded={expandedAccordion === 'share'}
            setExpanded={expanded => setExpandedAccordion(expanded ? 'share' : null)}
          />,
          mobile ? (
            <MenuAccordion
              key='legal'
              title={t('legal')}
              items={legalItems}
              expanded={expandedAccordion === 'legal'}
              setExpanded={expanded => setExpandedAccordion(expanded ? 'legal' : null)}
            />
          ) : null,
        ])}
      </StyledMenu>
    </>
  )
}

export default HeaderMenu
