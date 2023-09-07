import React, { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import Tooltip from './Tooltip'
import Icon from './base/Icon'

const StyledIcon = styled(Icon)`
  width: 28px;
  height: 28px;
`

type HeaderActionItemLinkProps = {
  href?: string
  text: string
  iconSrc: string
  iconDirectionDependent?: boolean
}

const HeaderActionItemLink = ({
  href,
  text,
  iconSrc,
  iconDirectionDependent = false,
}: HeaderActionItemLinkProps): ReactElement => (
  <Tooltip text={text} flow='down' smallViewportFlow='left'>
    {href ? (
      <Link to={href} aria-label={text}>
        <StyledIcon src={iconSrc} directionDependent={iconDirectionDependent} />
      </Link>
    ) : (
      <span aria-label={text}>
        <StyledIcon src={iconSrc} directionDependent={iconDirectionDependent} />
      </span>
    )}
  </Tooltip>
)

export default HeaderActionItemLink
