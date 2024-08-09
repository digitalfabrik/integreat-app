import React, { ReactElement } from 'react'
import styled from 'styled-components'

import Icon from './base/Icon'
import Link from './base/Link'

const StyledLink = styled(Link)`
  display: flex;
  flex: 1;
  text-decoration: none;
  padding: 24px 0;
  border-bottom: 1px solid ${props => props.theme.colors.themeColor};

  & > span {
    padding: 0 28px;
    align-self: center;
    color: ${props => props.theme.colors.textColor};
  }
`

const StyledIcon = styled(Icon)`
  width: 24px;
  height: 24px;
`

type KebabActionItemLinkProps = {
  href?: string
  text: string
  iconSrc: string
}

const KebabActionItemLink = ({ href, text, iconSrc }: KebabActionItemLinkProps): ReactElement => (
  // @ts-expect-error wrong types from polymorphic 'as', see https://github.com/styled-components/styled-components/issues/4112
  <StyledLink {...(href ? { to: href } : { as: 'span' })} aria-label={text} dir='auto'>
    <StyledIcon src={iconSrc} />
    <span>{text}</span>
  </StyledLink>
)

export default KebabActionItemLink
