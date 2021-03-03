// @flow

import * as React from 'react'
import Link from 'redux-first-router-link'
import styled, { type StyledComponent } from 'styled-components'
import type { ThemeType } from 'build-configs/ThemeType'
import dimensions from '../../theme/constants/dimensions'

type PropsType = {|
  link: string,
  src: string,
  alt: string
|}

const LogoContainer: StyledComponent<{||}, ThemeType, *> = styled.div`
  box-sizing: border-box;
  height: ${dimensions.headerHeightLarge}px;
  padding: 0 10px;
  display: flex;
  justify-content: start;
  align-items: center;
  flex: 0 1 220px;
  order: 1;

  & a {
    width: 100%;
    height: 60%;
  }

  & img {
    height: 100%;
    max-width: 100%;
    object-fit: contain;
  }

  @media ${dimensions.smallViewport} {
    height: ${dimensions.headerHeightSmall}px;
    flex: 1 1 0%; /* The % unit is necessary for IE11 */

    & a {
      max-height: 75%;
    }
  }
`

/**
 * A logo component designed for the Header.
 */
export class HeaderLogo extends React.PureComponent<PropsType> {
  render () {
    const { link, src, alt } = this.props
    return <LogoContainer>
      <Link to={link}>
        <img src={src} alt={alt} />
      </Link>
    </LogoContainer>
  }
}

export default HeaderLogo
