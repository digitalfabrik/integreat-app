import React, { ReactElement } from 'react'
import styled from 'styled-components'

import Tooltip from './Tooltip'
import Icon from './base/Icon'
import Link from './base/Link'

const StyledIcon = styled(Icon)`
  width: 28px;
  height: 28px;
`

type HeaderActionItemLinkProps = {
  to?: string
  text: string
  iconSrc: string
}

const HeaderActionItemLink = ({ to, text, iconSrc }: HeaderActionItemLinkProps): ReactElement => (
  <Tooltip text={text} flow='down' smallViewportFlow='left'>
    {to ? (
      <Link to={to} ariaLabel={text}>
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
