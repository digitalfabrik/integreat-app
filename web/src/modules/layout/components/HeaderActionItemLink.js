// @flow

import React from 'react'
import Link from 'redux-first-router-link'
import styled, { type StyledComponent } from 'styled-components'
import dimensions from '../../theme/constants/dimensions'
import type { ThemeType } from 'build-configs/ThemeType'
import Tooltip from '../../common/components/Tooltip'
import type { UiDirectionType } from '../../i18n/types/UiDirectionType'

const StyledLink: StyledComponent<{||}, ThemeType, *> = styled(Link)`
  display: block;

  width: calc(0.8 * ${dimensions.headerHeightLarge}px);
  height: calc(0.8 * ${dimensions.headerHeightLarge}px);

  @media ${dimensions.smallViewport} {
    width: calc(0.8 * ${dimensions.headerHeightSmall}px);
    height: calc(0.8 * ${dimensions.headerHeightSmall}px);
  }

  & > img {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 22%;
    object-fit: contain;
  }
`

// $FlowFixMe withComponent exists
const StyledSpan: StyledComponent<{||}, ThemeType, *> = StyledLink.withComponent('span')

type PropsType = {|
  href?: string,
  text: string,
  iconSrc: string,
  direction: UiDirectionType
|}

/**
 * Designed to work with Header. In the ActionBar you can display icons as link or dropDown involving actions like
 * 'Change language', 'Change location' and similar items.
 */
const HeaderActionItemLink = ({ href, text, iconSrc, direction }: PropsType) => {
  return (
    <Tooltip text={text} flow='down' smallViewportFlow='left' direction={direction}>
      {href ? (
        <StyledLink to={href} aria-label={text}>
          <img alt='' src={iconSrc} />
        </StyledLink>
      ) : (
        <StyledSpan aria-label={text}>
          <img alt='' src={iconSrc} />
        </StyledSpan>
      )}
    </Tooltip>
  )
}

export default HeaderActionItemLink
