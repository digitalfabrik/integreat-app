import React, { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { UiDirectionType } from 'translations/src'

import dimensions from '../constants/dimensions'
import IconWithUiDirection from './IconWithUiDirection'
import Tooltip from './Tooltip'

const StyledLink = styled(Link)`
  display: block;

  width: calc(0.8 * ${dimensions.headerHeightLarge}px);
  height: calc(0.8 * ${dimensions.headerHeightLarge}px);

  @media ${dimensions.smallViewport} {
    width: calc(0.5 * ${dimensions.headerHeightSmall}px);
    height: calc(0.5 * ${dimensions.headerHeightSmall}px);
  }

  & > img {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 22%;
    object-fit: contain;
  }
`

const StyledSpan = StyledLink.withComponent('span')

type HeaderActionItemLinkProps = {
  href?: string
  text: string
  iconSrc: string
  direction?: UiDirectionType
}

/**
 * Designed to work with Header. In the ActionBar you can display icons as link or dropDown involving actions like
 * 'Change language', 'Change location' and similar items.
 */
const HeaderActionItemLink = ({ href, text, iconSrc, direction }: HeaderActionItemLinkProps): ReactElement => (
  <Tooltip text={text} flow='down' smallViewportFlow='left'>
    {href ? (
      <StyledLink to={href} aria-label={text}>
        <IconWithUiDirection alt='' src={iconSrc} direction={direction} />
      </StyledLink>
    ) : (
      <StyledSpan aria-label={text}>
        <IconWithUiDirection alt='' src={iconSrc} direction={direction} />
      </StyledSpan>
    )}
  </Tooltip>
)

export default HeaderActionItemLink
