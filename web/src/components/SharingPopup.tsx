import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { getSlugFromPath, POIS_ROUTE } from 'api-client'
import { UiDirectionType } from 'translations'

import { CloseIcon, FacebookIcon, MailSocialIcon, ShareActiveIcon, ShareIcon, WhatsappIcon } from '../assets'
import dimensions from '../constants/dimensions'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { RouteType } from '../routes'
import Portal from './Portal'
import ToolbarItem from './ToolbarItem'
import Tooltip from './Tooltip'

type SharingPopupProps = {
  shareUrl: string
  title: string
  flow: 'vertical' | 'horizontal'
  direction: UiDirectionType
  route: RouteType
}

const TooltipContainer = styled.div<{
  flow: 'vertical' | 'horizontal'
  active: boolean
  direction: UiDirectionType
  additionalPadding: number
  horizontalPosition?: number
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
      flex-flow: column-reverse;
      transform: translateY(-100%);
    `};

  ${props =>
    props.flow === 'horizontal' &&
    (props.direction === 'ltr'
      ? css`
          transform: translateX(30%);
        `
      : css`
          transform: translate(-30%);
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
      props.flow === 'vertical' &&
      (props.direction === 'ltr'
        ? css`
            left: 20px;
            bottom: -8px;
            transform: rotate(-180deg);
          `
        : css`
            bottom: -8px;
            transform: translateX(-55%) rotate(180deg);
          `)};

    ${props =>
      props.flow === 'horizontal' &&
      (props.direction === 'ltr'
        ? css`
            left: -15px;
            transform: rotate(-90deg);
            top: 45%;
          `
        : css`
            right: -15px;
            transform: rotate(90deg);
            top: 45%;
          `)};

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
      props.flow === 'vertical' &&
      (props.direction === 'ltr'
        ? css`
            left: 20px;
            bottom: -11px;
            transform: rotate(-180deg);
          `
        : css`
            bottom: -11px;
            transform: translateX(-45%) rotate(180deg);
          `)};

    ${props =>
      props.flow === 'horizontal' &&
      (props.direction === 'ltr'
        ? css`
            left: -17px;
            transform: rotate(-90deg) scaleX(-1);
            top: 45%;
          `
        : css`
            right: -18px;
            transform: rotate(90deg) scaleX(-1);
            top: 45%;
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
`

const BackdropContainer = styled.div`
  background: transparent;
  width: 100%;
  height: 100%;
  z-index: 500;
  top: 0;
  left: 0;
  position: fixed;
`

const SharingPopupContainer = styled.div`
  position: relative;
`

const SharingPopup = ({ shareUrl, title, flow, direction, route }: SharingPopupProps): ReactElement => {
  const { t } = useTranslation('socialMedia')
  const [shareOptionsVisible, setShareOptionsVisible] = useState<boolean>(false)
  const { viewportSmall } = useWindowDimensions()
  const isPoisDetailPage = route === POIS_ROUTE && getSlugFromPath(window.location.pathname) !== POIS_ROUTE
  const encodedTitle = encodeURIComponent(title)
  const encodedShareUrl = encodeURIComponent(shareUrl)
  const shareMessage = t('layout:shareMessage')

  return (
    <SharingPopupContainer>
      <Portal className='sharing-popup-backdrop' show={shareOptionsVisible}>
        <BackdropContainer
          onClick={() => setShareOptionsVisible(false)}
          role='button'
          tabIndex={0}
          onKeyPress={() => setShareOptionsVisible(false)}
        />
      </Portal>
      {shareOptionsVisible && (
        <TooltipContainer
          flow={flow}
          active={shareOptionsVisible}
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
            <CloseButton onClick={() => setShareOptionsVisible(false)} aria-label={t('mailTooltip')}>
              <Icon src={CloseIcon} alt='' direction={direction} />
            </CloseButton>
          </Tooltip>
        </TooltipContainer>
      )}
      <ToolbarItem
        icon={shareOptionsVisible ? ShareActiveIcon : ShareIcon}
        text={t('layout:share')}
        onClick={() => setShareOptionsVisible(true)}
      />
    </SharingPopupContainer>
  )
}

export default SharingPopup
