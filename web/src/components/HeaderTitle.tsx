import * as React from 'react'
import { ReactNode } from 'react'
import styled from 'styled-components'

import dimensions from '../constants/dimensions'

type HeaderTitleProps = {
  children?: string
}

const LONG_TITLE_LENGTH = 25
export const HEADER_TITLE_HEIGHT = 50

const HeaderTitleDiv = styled.div<{ long: boolean }>`
  display: flex;
  align-items: center;
  font-size: ${props => (props.long ? '1.3rem' : '1.8rem')};
  max-height: ${dimensions.headerHeightLarge};
  font-weight: 800;
  flex: 1;
  order: 2;
  padding: 0 10px;
  box-sizing: border-box;

  @media ${dimensions.minMaxWidth} {
    font-size: ${props => (props.long ? '1.5rem' : '1.8rem')};
  }

  @media ${dimensions.smallViewport} {
    font-family: ${props => props.theme.fonts.web.decorativeFont};
    font-size: ${props => props.theme.fonts.decorativeFontSize};
    height: ${HEADER_TITLE_HEIGHT}px;
    justify-content: start;
    padding: 0 10px;
    text-align: left;
    align-self: center;
    font-weight: 400;
  }
`

/**
 * The title of a Header. Is only designed for the Header component.
 */
class HeaderTitle extends React.PureComponent<HeaderTitleProps> {
  render(): ReactNode {
    const { children } = this.props
    return <HeaderTitleDiv long={(children?.length || 0) >= LONG_TITLE_LENGTH}>{children}</HeaderTitleDiv>
  }
}

export default HeaderTitle
