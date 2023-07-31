import React, { ReactElement, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { CloseIcon, FacebookIcon, MailSocialIcon, TwitterIcon, WhatsappIcon } from '../assets'

type SocialMediaTooltipProps = {
  active: boolean
  children: ReactNode
  shareLink: string
  title?: string
  onClose: () => void
  direction: 'top' | 'right'
}

const Tooltip = styled.div<{ direction: 'top' | 'right' }>`
  background: #ffffff;
  padding: 8px;
  border: 2px solid #c7c7c7;
  width: max-content;
  position: absolute;
  color: #555555;
  display: flex;
  z-index: 2000;

  ${props =>
    props.direction === 'top' &&
    css`
      bottom: 70px;
      flex-direction: column-reverse;
      margin-left: -10px;
    `};

  ${props =>
    props.direction === 'right' &&
    css`
      left: 150px;
    `};

  &:before,
  &:after {
    position: absolute;
    content: '';
    display: block;
  }

  &:before {
    z-index: 2;
    border-bottom: 10px solid #ffffff;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;

    ${props =>
      props.direction === 'top' &&
      css`
        left: 20px;
        bottom: -8px;
        transform: rotate(-180deg);
      `};
    ${props =>
      props.direction === 'right' &&
      css`
        top: 45%;
        left: -14px;
        transform: rotate(-90deg);
      `};
  }

  &:after {
    z-index: 1;
    border-bottom: 11px solid #c7c7c7;
    border-left: 11px solid transparent;
    border-right: 11px solid transparent;

    transform: rotate(-90deg);
    ${props =>
      props.direction === 'top' &&
      css`
        left: 20px;
        bottom: -11px;
        transform: rotate(-180deg);
      `};
    ${props =>
      props.direction === 'right' &&
      css`
        left: -17px;
        top: 45%;
        transform: rotate(-90deg);
      `};
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

// TODO consider rtl, find title fallback or sharing message including title "Teile Stadt Augsburg von Integreat"

const SocialMediaTooltip = ({
  active,
  children,
  shareLink,
  onClose,
  title = 'Integreat',
  direction,
}: SocialMediaTooltipProps): ReactElement => (
  <div>
    {active && (
      <Tooltip direction={direction}>
        <Link href={`https://api.whatsapp.com/send?text=${title}%0a${shareLink}`} target='_blank'>
          <Icon src={WhatsappIcon} direction='ltr' alt='' />
        </Link>
        <Link href={`http://www.facebook.com/sharer/sharer.php?u=${shareLink}&t${title}`} target='_blank'>
          <Icon src={FacebookIcon} direction='ltr' alt='' />
        </Link>
        <Link href={`http://www.twitter.com/intent/tweet?url=${shareLink}&text=${title}`} target='_blank'>
          <Icon src={TwitterIcon} direction='ltr' alt='' />
        </Link>
        <Link href={`mailto:?subject=${title}&body=${shareLink}`}>
          <Icon src={MailSocialIcon} direction='ltr' alt='' />
        </Link>
        <CloseButton onClick={onClose}>
          <Icon src={CloseIcon} direction='ltr' alt='' />
        </CloseButton>
      </Tooltip>
    )}
    {children}
  </div>
)

export default SocialMediaTooltip
