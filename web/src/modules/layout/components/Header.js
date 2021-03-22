// @flow

import * as React from 'react'
import Headroom from '@integreat-app/react-sticky-headroom'
import styled, { type StyledComponent } from 'styled-components'
import withPlatform from '../../platform/hocs/withPlatform'
import Platform from '../../platform/Platform'
import type { ThemeType } from 'build-configs/ThemeType'
import HeaderTitle, { HEADER_TITLE_HEIGHT } from './HeaderTitle'
import HeaderLogo from './HeaderLogo'
import dimensions from '../../theme/constants/dimensions'

type PropsType = {|
  navigationItems: Array<React.Node>,
  actionItems: Array<React.Node>,
  logoHref: string,
  viewportSmall: boolean,
  cityName?: string,
  onStickyTopChanged: number => void,
  platform: Platform
|}

const HeaderContainer: StyledComponent<{||}, ThemeType, *> = styled.header`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 2px 5px -3px rgba(0, 0, 0, 0.2);
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  user-select: none;
  flex-direction: column;
  overflow: visible;

  @media ${dimensions.minMaxWidth} {
    padding-right: calc((200% - 100vw - ${dimensions.maxWidth}px) / 2);
    padding-left: calc((100vw - ${dimensions.maxWidth}px) / 2);
  }
`

const Row: StyledComponent<{| hasTitle?: boolean |}, ThemeType, *> = styled.div`
  display: flex;
  flex: 1;
  max-width: 100%;
  align-items: stretch;
  min-height: ${dimensions.headerHeightLarge}px;
  flex-direction: row;

  :first-child {
    z-index: 1; /* Necessary to make the LanguageFlyout cover the NavigationItems as they have opacity set */
  }

  @media ${dimensions.smallViewport} {
    justify-content: space-between;
    flex-wrap: wrap;
    min-height: ${dimensions.headerHeightSmall}px;

    :first-child {
      /* this is only necessary for IE11 */
      min-height: ${props => dimensions.headerHeightSmall + (props.hasTitle ? HEADER_TITLE_HEIGHT : 0)}px;
    }
  }
`

const HeaderSeparator: StyledComponent<{||}, ThemeType, *> = styled.div`
  align-self: center;
  height: ${dimensions.headerHeightLarge / 2}px;
  width: 2px;
  margin: 0 5px;
  background-color: ${props => props.theme.colors.textDecorationColor};
  order: 2;

  @media ${dimensions.smallViewport} {
    display: none;
  }
`

const ActionBar: StyledComponent<{||}, ThemeType, *> = styled.div`
  order: 3;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  @media ${dimensions.smallViewport} {
    order: 2;
    flex: 1 1 0%; /* The % unit is necessary for IE11 */
  }
`

const NavigationBar: StyledComponent<{||}, ThemeType, *> = styled.div`
  display: flex;
  padding: 0 10px;
  flex: 1 1 0%; /* The % unit is necessary for IE11 */
  align-items: stretch;
  justify-content: space-evenly;
`

/**
 * The standard header which can supplied to a Layout. Displays a logo left, a HeaderMenuBar in the middle and a
 * HeaderActionBar at the right (RTL: vice versa). On small viewports the HeaderMenuBar is shown underneath the rest
 * of the Header.
 * Uses Headroom to save space when scrolling.
 */
export const Header = ({
  viewportSmall,
  onStickyTopChanged,
  actionItems = [],
  logoHref,
  navigationItems = [],
  platform,
  cityName
}: PropsType) => {
  const { headerHeightSmall, headerHeightLarge } = dimensions
  const hasNavigationBar = navigationItems.length > 0
  const height = viewportSmall
    ? (1 + (hasNavigationBar ? 1 : 0)) * headerHeightSmall + (cityName ? HEADER_TITLE_HEIGHT : 0)
    : (1 + (hasNavigationBar ? 1 : 0)) * headerHeightLarge
  const scrollHeight = viewportSmall ? headerHeightSmall + (cityName ? HEADER_TITLE_HEIGHT : 0) : headerHeightLarge

  return (
    <Headroom
      onStickyTopChanged={onStickyTopChanged}
      scrollHeight={scrollHeight}
      height={height}
      positionStickyDisabled={platform.positionStickyDisabled}>
      <HeaderContainer>
        <Row hasTitle={!!cityName}>
          <HeaderLogo link={logoHref} />
          {!viewportSmall && cityName && <HeaderSeparator />}
          {(!viewportSmall || cityName) && <HeaderTitle>{cityName}</HeaderTitle>}
          <ActionBar>{actionItems}</ActionBar>
        </Row>
        {hasNavigationBar && (
          <Row>
            <NavigationBar>{navigationItems}</NavigationBar>
          </Row>
        )}
      </HeaderContainer>
    </Headroom>
  )
}

export default withPlatform(Header)
