import React, { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { UiDirectionType } from 'translations/src'

import IconWithUiDirection from './IconWithUiDirection'

const StyledLink = styled(Link)`
  display: flex;
  text-decoration: none;
  padding: 24px 0;
  border-bottom: 1px solid ${props => props.theme.colors.themeColor};

  & > span {
    padding: 0 28px;
    align-self: center;
    color: ${props => props.theme.colors.textColor};
  }
`
const StyledSpan = StyledLink.withComponent('span')

type KebabActionItemLinkPropsType = {
  href?: string
  text: string
  iconSrc: string
  direction?: UiDirectionType
}

const KebabActionItemLink = ({ href, text, iconSrc, direction }: KebabActionItemLinkPropsType): ReactElement => {
  if (href) {
    return (
      <StyledLink to={href} aria-label={text} dir='auto' data-testid='kebab-action-item'>
        <IconWithUiDirection alt='' src={iconSrc} width='24px' height='24px' direction={direction} />
        <span>{text}</span>
      </StyledLink>
    )
  }
  return (
    <StyledSpan aria-label={text} dir='auto' style={{ flex: 1 }} data-testid='kebab-action-item'>
      <IconWithUiDirection alt='' src={iconSrc} width='24px' height='24px' direction={direction} />
      <span>{text}</span>
    </StyledSpan>
  )
}

export default KebabActionItemLink
