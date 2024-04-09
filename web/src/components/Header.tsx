import Headroom from '@integreat-app/react-sticky-headroom'
import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

import dimensions from '../constants/dimensions'
import useWindowDimensions from '../hooks/useWindowDimensions'
import CityContentFooter from './CityContentFooter'
import HeaderLogo from './HeaderLogo'
import { HeaderNavigationItemProps } from './HeaderNavigationItem'
import HeaderTitle from './HeaderTitle'
import KebabMenu from './KebabMenu'
import NavigationBarScrollContainer from './NavigationBarScrollContainer'

type HeaderProps = {
  navigationItems: Array<ReactElement<HeaderNavigationItemProps>>
  actionItems: Array<ReactNode>
  kebabItems: Array<ReactNode>
  logoHref: string
  cityName?: string
  cityCode?: string
  isSidebarOpen?: boolean
  setIsSidebarOpen?: (show: boolean) => void
  language: string
}

const HeaderContainer = styled.header`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  user-select: none;
  flex-direction: column;
  overflow: visible;
  box-shadow: 0 2px 5px -3px rgb(0 0 0 / 20%);

  @media ${dimensions.minMaxWidth} {
    padding-inline: calc((100vw - ${dimensions.maxWidth}px) / 2) calc((200% - 100vw - ${dimensions.maxWidth}px) / 2);
  }
`

const Row = styled.div`
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
    background-color: ${props => props.theme.colors.backgroundAccentColor};
    justify-content: space-between;
    flex-wrap: wrap;
    min-height: ${dimensions.headerHeightSmall}px;
    overflow-x: auto;
    padding: 8px 0;
    box-shadow: 0 2px 5px -3px rgb(0 0 0 / 20%);

    :first-child {
      box-shadow: 0 2px 5px -3px rgb(0 0 0 / 12%);
      padding: 0 4px;
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
  gap: 12px;
  padding: 0 16px;

  @media ${dimensions.smallViewport} {
    order: 2;
    flex: 1 1 0;
  }
`

const NavigationBar = styled.nav`
  display: flex;
  flex: 1 1 0;
  align-items: stretch;
  justify-content: center;
  gap: 24px;

  @media ${dimensions.mediumLargeViewport} {
    padding: 0 10px;
  }
`

export const Header = ({
  actionItems = [],
  kebabItems = [],
  logoHref,
  navigationItems = [],
  cityName,
  cityCode,
  isSidebarOpen = false,
  setIsSidebarOpen,
  language,
}: HeaderProps): ReactElement => {
  const { viewportSmall } = useWindowDimensions()
  const { headerHeightSmall, headerHeightLarge } = dimensions
  const hasNavigationBar = navigationItems.length > 0
  const height = viewportSmall
    ? (1 + (hasNavigationBar ? 1 : 0)) * headerHeightSmall
    : (1 + (hasNavigationBar ? 1 : 0)) * headerHeightLarge
  const scrollHeight = viewportSmall ? headerHeightSmall : headerHeightLarge

  return (
    <Headroom scrollHeight={scrollHeight} height={height}>
      <HeaderContainer>
        <Row>
          <HeaderLogo link={logoHref} />
          {!viewportSmall && !!cityName && <HeaderSeparator />}
          {!!cityName && <HeaderTitle title={cityName} />}
          <ActionBar>
            {actionItems}
            {viewportSmall && setIsSidebarOpen && !!cityCode && (
              <KebabMenu
                setShow={setIsSidebarOpen}
                show={isSidebarOpen}
                items={kebabItems}
                Footer={<CityContentFooter city={cityCode} language={language} mode='sidebar' />}
              />
            )}
          </ActionBar>
        </Row>
        {hasNavigationBar && (
          <NavigationBarScrollContainer activeIndex={navigationItems.findIndex(el => el.props.active)}>
            <NavigationBar id='navigation-bar'>{navigationItems}</NavigationBar>
          </NavigationBarScrollContainer>
        )}
      </HeaderContainer>
    </Headroom>
  )
}

export default Header
