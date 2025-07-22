import { css, useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined'
import MailOutlinedIcon from '@mui/icons-material/MailOutlined'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import { IconButton } from '@mui/material'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PlacesType } from 'react-tooltip'

import useWindowDimensions from '../hooks/useWindowDimensions'
import Portal from './Portal'
import ToolbarItem from './ToolbarItem'
import Button from './base/Button'
import Link from './base/Link'
import Tooltip from './base/Tooltip'

type SharingPopupProps = {
  shareUrl: string
  title: string
  flow: 'vertical' | 'horizontal'
  portalNeeded: boolean
}

const TooltipContainer = styled.div<{
  tooltipFlow: 'vertical' | 'horizontal'
  optionsVisible: boolean
}>`
  background-color: ${props => props.theme.colors.backgroundColor};
  padding: 8px;
  border: 2px solid ${props => props.theme.colors.textDecorationColor};
  width: max-content;
  position: absolute;
  display: flex;
  z-index: 2000;
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
    border-bottom: 10px solid ${props => props.theme.colors.backgroundColor};
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
    border-bottom: 11px solid ${props => props.theme.colors.textDecorationColor};
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

const BackdropContainer = styled(Button)`
  background: transparent;
  width: 100%;
  height: 100%;
  top: 0;
  inset-inline-start: 0;
  position: fixed;
  z-index: 1;
`

const SharingPopupContainer = styled.div`
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

  const { viewportSmall } = useWindowDimensions()
  const theme = useTheme()
  const tooltipDirectionMobile: PlacesType = theme.contentDirection === 'ltr' ? 'right' : 'left'
  const tooltipDirection: PlacesType = viewportSmall ? tooltipDirectionMobile : 'top'

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).catch(reportError)
    setLinkCopied(true)
    setTimeout(() => {
      setLinkCopied(false)
    }, COPY_TIMEOUT)
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
            <Tooltip
              id='copy'
              place={tooltipDirection}
              tooltipContent={t(linkCopied ? 'common:copied' : 'layout:copyUrl')}>
              <IconButton
                name={t(linkCopied ? 'common:copied' : 'layout:copyUrl')}
                aria-label={t(linkCopied ? 'common:copied' : 'layout:copyUrl')}
                size='large'
                onClick={copyToClipboard}>
                {linkCopied ? <CheckIcon fontSize='inherit' /> : <ContentCopyIcon fontSize='inherit' />}
              </IconButton>
            </Tooltip>
            <Tooltip id='share-whatsapp' place={tooltipDirection} tooltipContent={t('whatsappTooltip')}>
              <Link to={`https://api.whatsapp.com/send?text=${shareMessage}%0a${encodedShareUrl}`}>
                <IconButton name={t('whatsappTooltip')} size='large' aria-label={t('whatsappTooltip')}>
                  <WhatsAppIcon fontSize='inherit' />
                </IconButton>
              </Link>
            </Tooltip>
            <Tooltip id='share-facebook' place={tooltipDirection} tooltipContent={t('facebookTooltip')}>
              <Link to={`https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}&t${shareMessage}`}>
                <IconButton name={t('facebookTooltip')} size='large' aria-label={t('facebookTooltip')}>
                  <FacebookOutlinedIcon fontSize='inherit' />
                </IconButton>
              </Link>
            </Tooltip>
            <Tooltip id='share-email' place={tooltipDirection} tooltipContent={t('mailTooltip')}>
              <Link to={`mailto:?subject=${encodedTitle}&body=${shareMessage} ${encodedShareUrl}`}>
                <IconButton name={t('mailTooltip')} size='large' aria-label={t('mailTooltip')}>
                  <MailOutlinedIcon fontSize='inherit' />
                </IconButton>
              </Link>
            </Tooltip>
            <Tooltip id='close-button' place={tooltipDirection} tooltipContent={t('closeTooltip')}>
              <IconButton
                name={t('closeTooltip')}
                size='large'
                onClick={() => setShareOptionsVisible(false)}
                aria-label={t('closeTooltip')}>
                <CloseIcon fontSize='inherit' />
              </IconButton>
            </Tooltip>
          </TooltipContainer>
        </>
      )}
      <ToolbarItem icon={ShareOutlinedIcon} text={t('layout:share')} onClick={() => setShareOptionsVisible(true)} />
    </SharingPopupContainer>
  )
}

export default SharingPopup
