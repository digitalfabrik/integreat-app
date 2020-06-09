// @flow

import * as React from 'react'
import Link from 'redux-first-router-link'
import styled from 'styled-components'
import type { ThemeType } from '../../theme/constants/theme'

type PropsType = {|
  theme: ThemeType,
  link: string,
  src: string,
  alt: string
|}

const LogoContainer = styled.div`
  box-sizing: border-box;
  flex-shrink: 1;
  height: ${props => props.theme.dimensions.headerHeightLarge}px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  order: 1;

  & a {
    width: 100%;
    height: 60%;
  }

  & img {
    max-width: 100%;
    max-height: 100%;
  }

  @media ${props => props.theme.dimensions.smallViewport} {
    height: ${props => props.theme.dimensions.headerHeightSmall}px;

    & a {
      max-height: 75%;
    }
  }
`

/**
 * The standard header which can supplied to a Layout. Displays a logo left, a HeaderMenuBar in the middle and a
 * HeaderActionBar at the right (RTL: vice versa). On small viewports the HeaderMenuBar is shown underneath the rest
 * of the Header.
 * Uses Headroom to save space when scrolling.
 */
export class HeaderLogo extends React.PureComponent<PropsType> {

  render () {
    const {
      theme, link, src, alt
    } = this.props
    return (<LogoContainer>
        <Link to={link} theme={theme}>
          <img src={src} alt={alt} />
        </Link>
      </LogoContainer>
    )
  }
}

export default HeaderLogo
