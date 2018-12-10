// @flow

import * as React from 'react'
import logoWide from '../assets/integreat-app-logo.png'
import HeaderNavigationBar from './HeaderNavigationBar'
import HeaderActionBar from './HeaderActionBar'
import HeaderActionItem from '../HeaderActionItem'
import Link from 'redux-first-router-link'
import Headroom from '@integreat-app/react-sticky-headroom'
import styled, { withTheme } from 'styled-components'
import withPlatform from '../../platform/hocs/withPlatform'
import Platform from '../../platform/Platform'
import compose from 'lodash/fp/compose'
import type { ThemeType } from '../../theme/constants/theme'

type PropsType = {|
  navigationItems: React.Node,
  actionItems: Array<HeaderActionItem>,
  logoHref: string,
  viewportSmall: boolean,
  theme: ThemeType,
  onStickyTopChanged: number => void,
  platform: Platform
|}

const HeaderContainer = styled.header`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  align-items: center;
  box-shadow: 0 2px 5px -3px rgba(0, 0, 0, 0.2);
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  user-select: none;
  
  & > div {
    display: flex;
    height: ${props => props.theme.dimensions.headerHeightLarge}px;
    align-items: center;
  }
  
  @media ${props => props.theme.dimensions.smallViewport} {
    flex-wrap: wrap;
    
    & > div {
      height: ${props => props.theme.dimensions.headerHeightSmall}px;
    }
  }
  
  @media ${props => props.theme.dimensions.minMaxWidth} {
    padding-right: calc((200% - 100vw - ${props => props.theme.dimensions.maxWidth}px) / 2);
    padding-left: calc((100vw - ${props => props.theme.dimensions.maxWidth}px) / 2);
  }
`

const LogoWide = styled.div`
  box-sizing: border-box;
  flex: 1 1 100px;
  order: 0;
  padding: 0 10px;
  
  & a {
    width: 100%;
    height: 60%;
  }
  
  & img {
    max-width: 100%;
    max-height: 100%;
  }
  
  @media ${props => props.theme.dimensions.smallViewport} {
    flex: 1 1 100px;
    
    & a {
      max-height: 75%;
    }
  }
`

const ActionBar = styled(HeaderActionBar)`
  flex: 1 1 100px;
  order: 2;
  
  @media ${props => props.theme.dimensions.smallViewport} {
    flex: 1 1 100px;
  }
`

const NavigationBar = styled(HeaderNavigationBar)`
  flex: 2 1 100px;
  order: 1;
  
  @media ${props => props.theme.dimensions.smallViewport} {
    flex: 1 0 100%;
    order: 3;
  }
`

/**
 * The standard header which can supplied to a Layout. Displays a logo left, a HeaderMenuBar in the middle and a
 * HeaderActionBar at the right (RTL: vice versa). On small viewports the HeaderMenuBar is shown underneath the rest
 * of the Header.
 * Uses Headroom to save space when scrolling.
 */
export class Header extends React.PureComponent<PropsType> {
  static defaultProps = {
    navigationItems: null,
    actionItems: []
  }

  render () {
    const {theme, viewportSmall, onStickyTopChanged, actionItems, logoHref, navigationItems, platform} = this.props
    const {headerHeightSmall, headerHeightLarge} = theme.dimensions
    const height = viewportSmall ? headerHeightSmall : headerHeightLarge
    const scrollHeight = viewportSmall ? headerHeightSmall : headerHeightLarge
    return (
      <Headroom onStickyTopChanged={onStickyTopChanged}
                scrollHeight={scrollHeight}
                height={height}
                positionStickyDisabled={platform.positionStickyDisabled}>
        <HeaderContainer>
          <LogoWide><Link to={logoHref}><img src={logoWide} /></Link></LogoWide>
          <NavigationBar>{navigationItems}</NavigationBar>
          <ActionBar items={actionItems} />
        </HeaderContainer>
      </Headroom>
    )
  }
}

export default compose(
  withPlatform,
  // $FlowFixMe https://github.com/styled-components/styled-components/issues/1785
  withTheme
)(Header)
