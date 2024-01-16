import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { CloseIcon, FacebookIcon, MailIcon, ShareIcon, WhatsappIcon } from '../assets'
import Portal from './Portal'
import ToolbarItem from './ToolbarItem'
import Tooltip from './Tooltip'
import Button from './base/Button'
import Icon from './base/Icon'

type SharingPopupProps = {
  shareUrl: string
  title: string
  flow: 'vertical' | 'horizontal'
  portalNeeded: boolean
}

const TooltipContainer = styled.div<{
  flow: 'vertical' | 'horizontal'
  active: boolean
}>`
  background-color: ${props => props.theme.colors.backgroundColor};
  padding: 8px;
  border: 2px solid ${props => props.theme.colors.textDecorationColor};
  inline-size: max-content;
  position: absolute;
  display: flex;
  z-index: 2000;
  opacity: 0;

  ${props =>
    props.flow === 'vertical' &&
    css`
      flex-flow: column-reverse;
      transform: translateY(-100%);
    `};

  ${props =>
    props.flow === 'horizontal' &&
    (props.theme.contentDirection === 'ltr'
      ? css`
          transform: translate(30%, -8px);
        `
      : css`
          transform: translate(-30%, -8px);
        `)};

  ${props =>
    props.active &&
    css`
      animation: tooltips 300ms ease-out forwards;
    `};

  &::before,
  &::after {
    position: absolute;
    content: '';
    display: block;
  }

  &::before {
    z-index: 2000;
    border-block-end: 10px solid ${props => props.theme.colors.backgroundColor};
    border-inline-start: 10px solid transparent;
    border-inline-end: 10px solid transparent;

    ${props =>
      props.flow === 'vertical' &&
      (props.theme.contentDirection === 'ltr'
        ? css`
            left: 20px;
            inset-block-end: -8px;
            transform: rotate(-180deg);
          `
        : css`
            right: 11px;
            inset-block-end: -8px;
            transform: translateX(-55%) rotate(180deg);
          `)};

    ${props =>
      props.flow === 'horizontal' &&
      (props.theme.contentDirection === 'ltr'
        ? css`
            left: -14px;
            transform: rotate(-90deg);
            inset-block-start: 45%;
          `
        : css`
            right: -14px;
            transform: rotate(90deg);
            inset-block-start: 45%;
          `)};

    ${props =>
      props.active &&
      css`
        animation: tooltips 300ms ease-out forwards;
      `};
  }

  &::after {
    z-index: 1000;
    border-block-end: 11px solid ${props => props.theme.colors.textDecorationColor};
    border-inline-start: 11px solid transparent;
    border-inline-end: 11px solid transparent;

    ${props =>
      props.flow === 'vertical' &&
      (props.theme.contentDirection === 'ltr'
        ? css`
            left: 20px;
            inset-block-end: -11px;
            transform: rotate(-180deg);
          `
        : css`
            right: 11px;
            inset-block-end: -11px;
            transform: translateX(-45%) rotate(180deg);
          `)};

    ${props =>
      props.flow === 'horizontal' &&
      (props.theme.contentDirection === 'ltr'
        ? css`
            left: -17px;
            transform: rotate(-90deg) scaleX(-1);
            inset-block-start: 45%;
          `
        : css`
            right: -17px;
            transform: rotate(90deg) scaleX(-1);
            inset-block-start: 45%;
          `)};

    ${props =>
      props.active &&
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

const CloseButton = styled(Button)`
  background-color: ${props => props.theme.colors.backgroundColor};
  display: flex;
`

const Link = styled.a`
  background-color: ${props => props.theme.colors.backgroundColor};
  border: none;
  padding: 0;
  display: flex;
`

const StyledIcon = styled(Icon)`
  inline-size: 32px;
  block-size: 32px;
  flex-shrink: 0;
  padding: 8px;
  object-fit: contain;
  align-self: center;
  color: ${props => props.theme.colors.textSecondaryColor};
`

const BackdropContainer = styled(Button)`
  background: transparent;
  inline-size: 100%;
  block-size: 100%;
  inset-block-start: 0;
  left: 0;
  position: fixed;
  z-index: 1;
`

const SharingPopupContainer = styled.div`
  position: relative;
`

const SharingPopup = ({ shareUrl, title, flow, portalNeeded }: SharingPopupProps): ReactElement => {
  const { t } = useTranslation('socialMedia')
  const [shareOptionsVisible, setShareOptionsVisible] = useState<boolean>(false)

  const encodedTitle = encodeURIComponent(title)
  const encodedShareUrl = encodeURIComponent(shareUrl)
  const shareMessage = t('layout:shareMessage', { message: encodedTitle })

  const Backdrop = (
    <BackdropContainer onClick={() => setShareOptionsVisible(false)} ariaLabel={t('closeTooltip')} tabIndex={0}>
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
          <TooltipContainer flow={portalNeeded ? 'horizontal' : flow} active={shareOptionsVisible}>
            <Tooltip text={t('whatsappTooltip')} flow='up'>
              <Link
                href={`https://api.whatsapp.com/send?text=${shareMessage}%0a${encodedShareUrl}`}
                target='_blank'
                aria-label={t('whatsappTooltip')}>
                <StyledIcon src={WhatsappIcon} />
              </Link>
            </Tooltip>
            <Tooltip text={t('facebookTooltip')} flow='up'>
              <Link
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}&t${shareMessage}`}
                target='_blank'
                aria-label={t('facebookTooltip')}>
                <StyledIcon src={FacebookIcon} />
              </Link>
            </Tooltip>
            <Tooltip text={t('mailTooltip')} flow='up'>
              <Link
                href={`mailto:?subject=${encodedTitle}&body=${shareMessage}${encodedShareUrl}`}
                aria-label={t('mailTooltip')}>
                <StyledIcon src={MailIcon} />
              </Link>
            </Tooltip>
            <Tooltip text={t('closeTooltip')} flow='up'>
              <CloseButton onClick={() => setShareOptionsVisible(false)} ariaLabel={t('closeTooltip')}>
                <StyledIcon src={CloseIcon} />
              </CloseButton>
            </Tooltip>
          </TooltipContainer>
        </>
      )}
      <ToolbarItem icon={ShareIcon} text={t('layout:share')} onClick={() => setShareOptionsVisible(true)} />
    </SharingPopupContainer>
  )
}

export default SharingPopup
