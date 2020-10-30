// @flow

import * as React from 'react'
import Headroom from '@integreat-app/react-sticky-headroom'
import styled, { withTheme } from 'styled-components'
import withPlatform from '../../platform/hocs/withPlatform'
import Platform from '../../platform/Platform'
import type { ThemeType } from '../../theme/constants/theme'
import buildConfig from '../../app/constants/buildConfig'
import HeaderTitle, { HEADER_TITLE_HEIGHT } from './HeaderTitle'
import HeaderLogo from './HeaderLogo'

type PropsType = {|
  navigationItems: Array<React.Node>,
  actionItems: Array<React.Node>,
  logoHref: string,
  viewportSmall: boolean,
  theme: ThemeType,
  cityName?: string,
  onStickyTopChanged: number => void,
  platform: Platform
|}

const HeaderContainer = styled.header`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 2px 5px -3px rgba(0, 0, 0, 0.2);
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  user-select: none;
  flex-direction: column;

  @media ${props => props.theme.dimensions.web.minMaxWidth} {
    padding-right: calc((200% - 100vw - ${props => props.theme.dimensions.web.maxWidth}px) / 2);
    padding-left: calc((100vw - ${props => props.theme.dimensions.web.maxWidth}px) / 2);
  }
`

const Row = styled.div`
  display: flex;
  flex: 1;
  max-width: 100%;
  overflow-x: auto;
  align-items: stretch;
  min-height: ${props => props.theme.dimensions.web.headerHeightLarge}px;
  flex-direction: row;

  :first-child {
    z-index: 1; /* Necessary to make the LanguageFlyout cover the NavigationItems as they have opacity set */
  }

  @media ${props => props.theme.dimensions.web.smallViewport} {
    justify-content: space-between;
    flex-wrap: wrap;
    min-height: ${props => props.theme.dimensions.web.headerHeightSmall}px;

    :first-child { /* this is only necessary for IE11 */
      min-height: ${props => props.theme.dimensions.web.headerHeightSmall + (props.hasTitle ? HEADER_TITLE_HEIGHT : 0)}px;
    }
  }
`

const HeaderSeparator = styled.div`
  align-self: center;
  height: ${props => props.theme.dimensions.web.headerHeightLarge / 2}px;
  width: 2px;
  margin: 0 5px;
  background-color: ${props => props.theme.colors.textDecorationColor};
  order: 2;

  @media ${props => props.theme.dimensions.web.smallViewport} {
    display: none;
  }
`

const ActionBar = styled.div`
  order: 3;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  @media ${props => props.theme.dimensions.web.smallViewport} {
    order: 2;
    flex: 1 1 0%; /* The % unit is necessary for IE11 */
  }
`

const NavigationBar = styled.div`
  display: flex;
  padding: 0 10px;
  flex: 1 1 0%; /* The % unit is necessary for IE11 */
  align-items: stretch;
  justify-content: center;
  overflow-y: hidden;
`

/**
 * The standard header which can supplied to a Layout. Displays a logo left, a HeaderMenuBar in the middle and a
 * HeaderActionBar at the right (RTL: vice versa). On small viewports the HeaderMenuBar is shown underneath the rest
 * of the Header.
 * Uses Headroom to save space when scrolling.
 */
export class Header extends React.PureComponent<PropsType> {
  static defaultProps = {
    navigationItems: [],
    actionItems: []
  }

  render () {
    const {
      theme, viewportSmall, onStickyTopChanged, actionItems, logoHref, navigationItems, platform, cityName
    } = this.props
    const { headerHeightSmall, headerHeightLarge } = theme.dimensions.web
    const hasNavigationBar = navigationItems.length > 0
    const height = viewportSmall
      ? (1 + (hasNavigationBar ? 1 : 0)) * headerHeightSmall + (cityName ? HEADER_TITLE_HEIGHT : 0)
      : (1 + (hasNavigationBar ? 1 : 0)) * headerHeightLarge
    const scrollHeight = viewportSmall
      ? headerHeightSmall + (cityName ? HEADER_TITLE_HEIGHT : 0)
      : headerHeightLarge
    return (
      <Headroom onStickyTopChanged={onStickyTopChanged}
                scrollHeight={scrollHeight}
                height={height}
                positionStickyDisabled={platform.positionStickyDisabled}>
        <HeaderContainer>
          <Row hasTitle={!!cityName}>
            <HeaderLogo theme={theme} link={logoHref} src={buildConfig().icons.headerLogo} alt={buildConfig().appName} />
            {!viewportSmall && cityName && <HeaderSeparator theme={theme} />}
            {(!viewportSmall || cityName) && <HeaderTitle theme={theme}>{cityName}</HeaderTitle>}
            <ActionBar>{actionItems}</ActionBar>
          </Row>
          {hasNavigationBar && <Row><NavigationBar>{navigationItems}</NavigationBar></Row>}
        </HeaderContainer>
      </Headroom>
    )
  }
}

export default withPlatform(
  withTheme(
    Header
  ))
