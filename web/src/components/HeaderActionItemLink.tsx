import React, { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import Tooltip from './Tooltip'
import Icon from './base/Icon'

const StyledIcon = styled(Icon)`
  inline-size: 28px;
  block-size: 28px;
`

type HeaderActionItemLinkProps = {
  href?: string
  text: string
  iconSrc: string
}

const HeaderActionItemLink = ({ href, text, iconSrc }: HeaderActionItemLinkProps): ReactElement => (
  <Tooltip text={text} flow='down' smallViewportFlow='left'>
    {href ? (
      <Link to={href} aria-label={text}>
        <StyledIcon src={iconSrc} />
      </Link>
    ) : (
      <span aria-label={text}>
        <StyledIcon src={iconSrc} />
      </span>
    )}
  </Tooltip>
)

export default HeaderActionItemLink
