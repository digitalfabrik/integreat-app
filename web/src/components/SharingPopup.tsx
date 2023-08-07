import React, { ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { getSlugFromPath, POIS_ROUTE } from 'api-client'
import { UiDirectionType } from 'translations'

import { CloseIcon, FacebookIcon, MailSocialIcon, WhatsappIcon } from '../assets'
import dimensions from '../constants/dimensions'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { RouteType } from '../routes'
import Tooltip from './Tooltip'

type SharingPopupProps = {
  active: boolean
  children: ReactNode
  shareUrl: string
  title: string
  onClose: () => void
  flow: 'vertical' | 'horizontal'
  direction: UiDirectionType
  route: RouteType
}

const SHARE_BUTTON_WIDTH = 50
const TooltipContainer = styled.div<{
  flow: 'vertical' | 'horizontal'
  active: boolean
  direction: UiDirectionType
  additionalPadding: number
}>`
  background-color: ${props => props.theme.colors.backgroundColor};
  padding: 8px;
  border: 2px solid ${props => props.theme.colors.textDecorationColor};
  width: max-content;
  position: absolute;
  display: flex;
  z-index: 2000;
  opacity: 0;

  ${props =>
    props.flow === 'vertical' &&
    css`
      bottom: ${dimensions.toolbarHeight + props.additionalPadding}px;
      flex-flow: column-reverse;
      margin-left: -10px;
    `};

  ${props =>
    props.flow === 'horizontal' &&
    (props.direction === 'ltr'
      ? css`
          left: ${dimensions.toolbarWidth - SHARE_BUTTON_WIDTH}px;
        `
      : css`
          right: ${dimensions.toolbarWidth - SHARE_BUTTON_WIDTH}px;
          transform: scaleX(-1);
          flex-direction: row-reverse;
        `)};

  ${props =>
    props.active &&
    css`
      animation: tooltips 300ms ease-out forwards;
    `};

  &:before,
  &:after {
    position: absolute;
    content: '';
    display: block;
  }

  &:before {
    z-index: 2000;
    border-bottom: 10px solid ${props => props.theme.colors.backgroundColor};
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;

    ${props =>
      props.flow === 'vertical'
        ? css`
            left: 20px;
            bottom: -8px;
            transform: rotate(-180deg);
          `
        : css`
            left: -14px;
            transform: rotate(-90deg);
            top: 45%;
          `};
    ${props =>
      props.active &&
      css`
        animation: tooltips 300ms ease-out forwards;
      `};
  }

  &:after {
    z-index: 1000;
    border-bottom: 11px solid ${props => props.theme.colors.textDecorationColor};
    border-left: 11px solid transparent;
    border-right: 11px solid transparent;

    ${props =>
      props.flow === 'vertical'
        ? css`
            left: 20px;
            bottom: -11px;
            transform: rotate(-180deg);
          `
        : css`
            left: -17px;
            transform: rotate(-90deg);
            top: 45%;
          `};
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

const CloseButton = styled.button`
  background-color: ${props => props.theme.colors.backgroundColor};
  border: none;
  padding: 0;
  display: flex;
`

const Link = styled.a`
  background-color: ${props => props.theme.colors.backgroundColor};
  border: none;
  padding: 0;
  display: flex;
`

const Icon = styled.img<{ direction: string }>`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  padding: 8px;
  object-fit: contain;
  align-self: center;

  ${props =>
    props.direction === 'rtl' &&
    css`
      transform: scaleX(-1);
    `};
`

const BackdropContainer = styled.div`
  background: red;
  width: 100%;
  height: 100%;
  z-index: 2000;
  top: 0;
  left: 0;
  position: fixed;
`

const SharingPopup = ({
  active,
  children,
  shareUrl,
  onClose,
  title,
  flow,
  direction,
  route,
}: SharingPopupProps): ReactElement => {
  const { t } = useTranslation('socialMedia')
  const { viewportSmall } = useWindowDimensions()
  const isPoisDetailPage = route === POIS_ROUTE && getSlugFromPath(window.location.pathname) !== POIS_ROUTE
  const encodedTitle = encodeURIComponent(title)
  const encodedShareUrl = encodeURIComponent(shareUrl)
  const shareMessage = t('layout:shareMessage')

  return (
    <div>
      {active && (
        <>
          <BackdropContainer onClick={onClose} role='button' tabIndex={0} onKeyPress={onClose} />
          <TooltipContainer
            flow={flow}
            active={active}
            direction={direction}
            additionalPadding={isPoisDetailPage && !viewportSmall ? dimensions.poiDetailNavigation : 0}>
            <Tooltip text={t('whatsappTooltip')} flow='up'>
              <Link
                href={`https://api.whatsapp.com/send?text=${shareMessage}${encodedTitle}%0a${encodedShareUrl}`}
                target='_blank'
                aria-label={t('whatsappTooltip')}>
                <Icon src={WhatsappIcon} direction={direction} alt='' />
              </Link>
            </Tooltip>
            <Tooltip text={t('facebookTooltip')} flow='up'>
              <Link
                href={`http://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}&t${shareMessage}${encodedTitle}`}
                target='_blank'
                aria-label={t('facebookTooltip')}>
                <Icon src={FacebookIcon} direction={direction} alt='' />
              </Link>
            </Tooltip>
            <Tooltip text={t('mailTooltip')} flow='up'>
              <Link
                href={`mailto:?subject=${encodedTitle}&body=${shareMessage}${encodedShareUrl}`}
                aria-label={t('mailTooltip')}>
                <Icon src={MailSocialIcon} direction={direction} alt='' />
              </Link>
            </Tooltip>
            <Tooltip text={t('closeTooltip')} flow='up'>
              <CloseButton onClick={onClose} aria-label={t('mailTooltip')}>
                <Icon src={CloseIcon} alt='' direction={direction} />
              </CloseButton>
            </Tooltip>
          </TooltipContainer>
        </>
      )}
      {children}
    </div>
  )
}

export default SharingPopup
