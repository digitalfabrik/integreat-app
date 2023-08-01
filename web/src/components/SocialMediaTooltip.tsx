import React, { ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { getSlugFromPath, POIS_ROUTE } from 'api-client/src'
import { UiDirectionType } from 'translations/src'

import { CloseIcon, FacebookIcon, MailSocialIcon, WhatsappIcon } from '../assets'
import dimensions from '../constants/dimensions'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { RouteType } from '../routes'
import Tooltip from './Tooltip'

type SocialMediaTooltipProps = {
  active: boolean
  children: ReactNode
  shareLink: string
  title: string
  onClose: () => void
  flow: 'top' | 'right'
  direction: UiDirectionType
  route: RouteType
}

const SHARE_BUTTON_WIDTH = 50
const TooltipContainer = styled.div<{
  flow: 'top' | 'right'
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
    props.flow === 'top' &&
    css`
      bottom: ${dimensions.toolbarHeight + props.additionalPadding}px;
      flex-flow: column-reverse;
      margin-left: -10px;
    `};

  ${props =>
    props.flow === 'right' &&
    props.direction === 'ltr' &&
    css`
      left: ${dimensions.toolbarWidth - SHARE_BUTTON_WIDTH}px;
    `};

  ${props =>
    props.flow === 'right' &&
    props.direction === 'rtl' &&
    css`
      right: ${dimensions.toolbarWidth - SHARE_BUTTON_WIDTH}px;
      transform: scaleX(-1);
      flex-direction: row-reverse;
    `};

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
      props.flow === 'top' &&
      css`
        left: 20px;
        bottom: -8px;
        transform: rotate(-180deg);
      `};
    ${props =>
      props.flow === 'right' &&
      css`
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
      props.flow === 'top' &&
      css`
        left: 20px;
        bottom: -11px;
        transform: rotate(-180deg);
      `};
    ${props =>
      props.flow === 'right' &&
      css`
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
  background: transparent;
  width: 100%;
  height: 100%;
  z-index: 2000;
  top: 0;
  left: 0;
  position: fixed;
`

const SocialMediaTooltip = ({
  active,
  children,
  shareLink,
  onClose,
  title,
  flow,
  direction,
  route,
}: SocialMediaTooltipProps): ReactElement => {
  const { t } = useTranslation('socialMedia')
  const { viewportSmall } = useWindowDimensions()
  const isPoisDetailPage = route === POIS_ROUTE && getSlugFromPath(window.location.pathname) !== POIS_ROUTE
  const encodedTitle = encodeURIComponent(title)
  const encodedShareLink = encodeURIComponent(shareLink)

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
            <Tooltip text={t('whatappTooltip')} flow='up'>
              <Link
                href={`https://api.whatsapp.com/send?text=${encodedTitle}%0a${encodedShareLink}`}
                target='_blank'
                data-testid='whatsapp'>
                <Icon src={WhatsappIcon} direction={direction} alt='' />
              </Link>
            </Tooltip>
            <Tooltip text={t('facebookTooltip')} flow='up'>
              <Link
                href={`http://www.facebook.com/sharer/sharer.php?u=${encodedShareLink}&t${encodedTitle}`}
                target='_blank'
                data-testid='facebook'>
                <Icon src={FacebookIcon} direction={direction} alt='' />
              </Link>
            </Tooltip>
            <Tooltip text={t('mailTooltip')} flow='up'>
              <Link href={`mailto:?subject=${encodedTitle}&body=${encodedShareLink}`} data-testid='mail'>
                <Icon src={MailSocialIcon} direction={direction} alt='' />
              </Link>
            </Tooltip>
            <CloseButton onClick={onClose}>
              <Icon src={CloseIcon} alt='' direction={direction} />
            </CloseButton>
          </TooltipContainer>
        </>
      )}
      {children}
    </div>
  )
}

export default SocialMediaTooltip
