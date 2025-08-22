import { css } from '@emotion/react'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined'
import MailOutlinedIcon from '@mui/icons-material/MailOutlined'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Portal from './Portal'
import ToolbarItem from './ToolbarItem'
import Button from './base/Button'
import Link from './base/Link'

type SharingPopupProps = {
  shareUrl: string
  title: string
  flow: 'vertical' | 'horizontal'
  portalNeeded: boolean
}

const TooltipContainer = styled('div')<{
  tooltipFlow: 'vertical' | 'horizontal'
  optionsVisible: boolean
}>`
  background-color: ${props => props.theme.legacy.colors.backgroundColor};
  padding: 8px;
  border: 2px solid ${props => props.theme.legacy.colors.textDecorationColor};
  width: max-content;
  position: absolute;
  display: flex;
  z-index: 10;
  opacity: 0;
  font-size: 1rem;

  ${props =>
    props.tooltipFlow === 'vertical'
      ? css`
          flex-flow: column-reverse;
          transform: translateY(-100%);
        `
      : css`
          transform: translate(30%, -8px);
        `};

  ${props =>
    props.optionsVisible &&
    css`
      animation: tooltips 300ms ease-out forwards;
    `};

  &::before,
  &::after {
    position: absolute;
    content: '';
    display: block;
  }

  /* White center of the arrow */

  &::before {
    z-index: 2000;
    border-bottom: 10px solid ${props => props.theme.legacy.colors.backgroundColor};
    border-inline-start: 10px solid transparent;
    border-inline-end: 10px solid transparent;

    ${props =>
      props.tooltipFlow === 'vertical'
        ? css`
            left: 20px;
            bottom: -8px;
            transform: rotate(-180deg);
          `
        : css`
            left: -14px;
            transform: rotate(${props.theme.contentDirection === 'ltr' ? '-90deg' : '90deg'});
            top: 45%;
          `};

    ${props =>
      props.optionsVisible &&
      css`
        animation: tooltips 300ms ease-out forwards;
      `};
  }

  /* Border of the arrow */

  &::after {
    z-index: 1000;
    border-bottom: 11px solid ${props => props.theme.legacy.colors.textDecorationColor};
    border-inline-start: 11px solid transparent;
    border-inline-end: 11px solid transparent;

    ${props =>
      props.tooltipFlow === 'vertical'
        ? css`
            left: 20px;
            bottom: -11px;
            transform: rotate(-180deg);
          `
        : css`
            left: -17px;
            transform: rotate(${props.theme.contentDirection === 'ltr' ? '-90deg' : '90deg'}) scaleX(-1);
            top: 45%;
          `};

    ${props =>
      props.optionsVisible &&
      css`
        animation: tooltips 300ms ease-out forwards;
      `};
  }

  @keyframes tooltips {
    to {
      opacity: 1;
    }
  }
`

const StyledIconButton = styled(IconButton)`
  color: ${props => props.theme.palette.text.primary};
`

const BackdropContainer = styled(Button)`
  background: transparent;
  width: 100%;
  height: 100%;
  top: 0;
  inset-inline-start: 0;
  position: fixed;
  z-index: 1;
`

const SharingPopupContainer = styled('div')`
  position: relative;
`

const COPY_TIMEOUT = 3000

const SharingPopup = ({ shareUrl, title, flow, portalNeeded }: SharingPopupProps): ReactElement => {
  const [shareOptionsVisible, setShareOptionsVisible] = useState<boolean>(false)
  const [linkCopied, setLinkCopied] = useState<boolean>(false)
  const { t } = useTranslation('socialMedia')

  const encodedTitle = encodeURIComponent(title)
  const encodedShareUrl = encodeURIComponent(shareUrl)
  const shareMessage = t('layout:shareMessage', { message: encodedTitle })

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).catch(reportError)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), COPY_TIMEOUT)
  }

  const Backdrop = (
    <BackdropContainer onClick={() => setShareOptionsVisible(false)} label={t('closeTooltip')} tabIndex={0}>
      <div />
    </BackdropContainer>
  )

  return (
    <SharingPopupContainer>
      {shareOptionsVisible && (
        <>
          {portalNeeded && (
            <Portal className='sharing-popup-backdrop-portal' show={shareOptionsVisible}>
              {Backdrop}
            </Portal>
          )}
          {Backdrop}
          <TooltipContainer tooltipFlow={flow} optionsVisible={shareOptionsVisible}>
            <Tooltip title={t(linkCopied ? 'common:copied' : 'layout:copyUrl')}>
              <StyledIconButton
                aria-label={t(linkCopied ? 'common:copied' : 'layout:copyUrl')}
                size='large'
                onClick={copyToClipboard}>
                {linkCopied ? <CheckIcon fontSize='inherit' /> : <ContentCopyIcon fontSize='inherit' />}
              </StyledIconButton>
            </Tooltip>
            <Tooltip title={t('whatsappTooltip')}>
              <Link to={`https://api.whatsapp.com/send?text=${shareMessage}%0a${encodedShareUrl}`}>
                <StyledIconButton size='large' aria-label={t('whatsappTooltip')}>
                  <WhatsAppIcon fontSize='inherit' />
                </StyledIconButton>
              </Link>
            </Tooltip>
            <Tooltip title={t('facebookTooltip')}>
              <Link to={`https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}&t${shareMessage}`}>
                <StyledIconButton size='large' aria-label={t('facebookTooltip')}>
                  <FacebookOutlinedIcon fontSize='inherit' />
                </StyledIconButton>
              </Link>
            </Tooltip>
            <Tooltip title={t('mailTooltip')}>
              <Link to={`mailto:?subject=${encodedTitle}&body=${shareMessage} ${encodedShareUrl}`}>
                <StyledIconButton size='large' aria-label={t('mailTooltip')}>
                  <MailOutlinedIcon fontSize='inherit' />
                </StyledIconButton>
              </Link>
            </Tooltip>
            <Tooltip title={t('closeTooltip')}>
              <StyledIconButton
                size='large'
                onClick={() => setShareOptionsVisible(false)}
                aria-label={t('closeTooltip')}>
                <CloseIcon fontSize='inherit' />
              </StyledIconButton>
            </Tooltip>
          </TooltipContainer>
        </>
      )}
      <ToolbarItem icon={ShareOutlinedIcon} text={t('layout:share')} onClick={() => setShareOptionsVisible(true)} />
    </SharingPopupContainer>
  )
}

export default SharingPopup
