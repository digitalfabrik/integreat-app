import Headroom from '@integreat-app/react-sticky-headroom'
import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

import { UiDirectionType } from 'translations'

import dimensions from '../constants/dimensions'
import HeaderLogo from './HeaderLogo'
import HeaderTitle, { HEADER_TITLE_HEIGHT } from './HeaderTitle'
import KebabMenu from './KebabMenu'

type PropsType = {
  navigationItems: Array<ReactNode>
  actionItems: Array<ReactNode>
  kebabItems: Array<ReactNode>
  logoHref: string
  viewportSmall: boolean
  cityName?: string
  direction: UiDirectionType
}

const HeaderContainer = styled.header`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  user-select: none;
  flex-direction: column;
  overflow: visible;

  @media ${dimensions.minMaxWidth} {
    padding-right: calc((200% - 100vw - ${dimensions.maxWidth}px) / 2);
    padding-left: calc((100vw - ${dimensions.maxWidth}px) / 2);
    box-shadow: 0 2px 5px -3px rgba(0, 0, 0, 0.2);
  }
`

const Row = styled.div<{ hasTitle?: boolean }>`
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
    overflow-x: auto;
    padding: 16px 12px;
    box-shadow: 0 2px 5px -3px rgba(0, 0, 0, 0.2);
    :first-child {
      box-shadow: 0 2px 5px -3px rgba(0, 0, 0, 0.12);
      padding: 8px 4px;
    }
  }
`

const HeaderSeparator = styled.div`
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

const ActionBar = styled.nav`
  order: 3;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  @media ${dimensions.smallViewport} {
    order: 2;
    flex: 1 1 0%; /* The % unit is necessary for IE11 */
  }
`

const NavigationBar = styled.nav`
  display: flex;
  padding: 0 10px;
  flex: 1 1 0%; /* The % unit is necessary for IE11 */
  align-items: stretch;
  justify-content: center;
`

/**
 * The standard header which can supplied to a Layout. Displays a logo left, a HeaderMenuBar in the middle and a
 * HeaderActionBar at the right (RTL: vice versa). On small viewports the HeaderMenuBar is shown underneath the rest
 * of the Header.
 * Uses Headroom to save space when scrolling.
 */
export const Header = ({
  viewportSmall,
  actionItems = [],
  kebabItems = [],
  logoHref,
  navigationItems = [],
  cityName,
  direction,
}: PropsType): ReactElement => {
  const { headerHeightSmall, headerHeightLarge } = dimensions
  const hasNavigationBar = navigationItems.length > 0
  const height = viewportSmall
    ? (1 + (hasNavigationBar ? 1 : 0)) * headerHeightSmall + (cityName ? HEADER_TITLE_HEIGHT : 0)
    : (1 + (hasNavigationBar ? 1 : 0)) * headerHeightLarge
  const scrollHeight = viewportSmall ? headerHeightSmall + (cityName ? HEADER_TITLE_HEIGHT : 0) : headerHeightLarge

  return (
    <Headroom scrollHeight={scrollHeight} height={height}>
      <HeaderContainer>
        <Row hasTitle={!!cityName}>
          <HeaderLogo link={logoHref} />
          {!viewportSmall && cityName && <HeaderSeparator />}
          {(!viewportSmall || cityName) && <HeaderTitle>{cityName}</HeaderTitle>}
          <ActionBar>
            {actionItems}
            {viewportSmall && <KebabMenu items={kebabItems} direction={direction} />}
          </ActionBar>
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

export default Header
