import Headroom from '@integreat-app/react-sticky-headroom'
import { styled } from '@mui/material/styles'
import React, { ReactElement, ReactNode } from 'react'

import { LANDING_ROUTE, pathnameFromRouteInformation } from 'shared'

import dimensions from '../constants/dimensions'
import useWindowDimensions from '../hooks/useWindowDimensions'
import CityContentFooter from './CityContentFooter'
import HeaderLogo from './HeaderLogo'
import { HeaderNavigationItemProps } from './HeaderNavigationItem'
import HeaderTitle from './HeaderTitle'
import KebabMenu from './KebabMenu'
import NavigationBarScrollContainer from './NavigationBarScrollContainer'

type HeaderProps = {
  navigationItems: ReactElement<HeaderNavigationItemProps>[]
  actionItems: ReactNode[]
  kebabItems: ReactNode[]
  logoHref: string
  cityName?: string
  cityCode?: string
  isSidebarOpen?: boolean
  setIsSidebarOpen?: (show: boolean) => void
  language: string
}

const HeaderContainer = styled('header')`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  background-color: ${props => props.theme.legacy.colors.backgroundAccentColor};
  user-select: none;
  flex-direction: column;
  overflow: visible;
  box-shadow: 0 2px 5px -3px rgb(0 0 0 / 20%);

  ${props => props.theme.breakpoints.up('lg')} {
    padding-inline: calc((100vw - ${props => props.theme.breakpoints.values.lg}px) / 2)
      calc((200% - 100vw - ${props => props.theme.breakpoints.values.lg}px) / 2);
  }
`

const Row = styled('div')`
  display: flex;
  flex: 1;
  max-width: 100%;
  align-items: center;
  min-height: ${dimensions.headerHeightLarge}px;
  flex-direction: row;
  justify-content: space-between;

  ${props => props.theme.breakpoints.down('md')} {
    background-color: ${props => props.theme.legacy.colors.backgroundAccentColor};
    justify-content: space-between;
    flex-wrap: wrap;
    min-height: ${dimensions.headerHeightSmall}px;
    overflow-x: auto;
  }
  ${props => props.theme.breakpoints.up('md')} {
    margin-inline-start: 80px;
  }
`

const ActionBar = styled('nav')`
  order: 3;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 0 12px;

  ${props => props.theme.breakpoints.down('md')} {
    padding: 0 8px;
    gap: 8px;
    order: 2;
  }
`

const NavigationBar = styled('nav')`
  display: flex;
  flex: 1 1 0;
  align-items: stretch;
  justify-content: center;
  gap: 24px;

  ${props => props.theme.breakpoints.up('md')} {
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
  const landingPath = pathnameFromRouteInformation({ route: LANDING_ROUTE, languageCode: language })

  return (
    <Headroom scrollHeight={scrollHeight} height={height} zIndex={2}>
      <HeaderContainer>
        <Row>
          <HeaderLogo link={logoHref} />
          {!!cityName && <HeaderTitle title={cityName} landingPath={landingPath} />}
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
