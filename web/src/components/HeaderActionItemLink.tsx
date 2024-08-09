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
  href?: string
  text: string
  iconSrc: string
}

const HeaderActionItemLink = ({ href, text, iconSrc }: HeaderActionItemLinkProps): ReactElement => (
  <Tooltip text={text} flow='down' smallViewportFlow='left'>
    {href ? (
      <Link to={href} ariaLabel={text}>
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
