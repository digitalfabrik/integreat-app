import React, { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

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

type PropsType = {
  href?: string
  text: string
  iconSrc: string
}

const KebabActionItemLink = ({ href, text, iconSrc }: PropsType): ReactElement => {
  if (href) {
    return (
      <StyledLink to={href} aria-label={text} dir='auto' data-testid='kebab-action-item'>
        <img alt='' src={iconSrc} width='24px' height='24px' />
        <span>{text}</span>
      </StyledLink>
    )
  }
  return (
    <StyledSpan aria-label={text} dir='auto' style={{ flex: 1 }} data-testid='kebab-action-item'>
      <img alt='' src={iconSrc} width='24px' height='24px' />
      <span>{text}</span>
    </StyledSpan>
  )
}

export default KebabActionItemLink
