import Headroom from '@integreat-app/react-sticky-headroom'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import React, { ReactElement, ReactNode } from 'react'

import { LANDING_ROUTE, pathnameFromRouteInformation } from 'shared'

import dimensions from '../constants/dimensions'
import useElementRect from '../hooks/useElementRect'
import useWindowDimensions from '../hooks/useWindowDimensions'
import CityContentFooter from './CityContentFooter'
import HeaderLogo from './HeaderLogo'
import HeaderTitle from './HeaderTitle'
import Sidebar from './Sidebar'

const HeaderContainer = styled('header')`
  user-select: none;
  flex-direction: column;

  ${props => props.theme.breakpoints.up('lg')} {
    padding-inline: calc((100vw - ${props => props.theme.breakpoints.values.lg}px) / 2)
      calc((200% - 100vw - ${props => props.theme.breakpoints.values.lg}px) / 2);
  }

  ${props => props.theme.breakpoints.up('md')} {
    margin-inline-start: 80px;
  }
`

const Row = styled('div')`
  display: flex;
  align-items: center;
  min-height: ${dimensions.headerHeightLarge}px;
  justify-content: space-between;
  flex-wrap: wrap;
  overflow-x: auto;

  ${props => props.theme.breakpoints.down('md')} {
    min-height: ${dimensions.headerHeightSmall}px;
  }
`

const ActionBar = styled('nav')`
  order: 3;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 0 12px;

  ${props => props.theme.breakpoints.down('md')} {
    order: 2;
  }
`

type HeaderProps = {
  actionItems: ReactNode[]
  sidebarItems: ReactNode[]
  logoHref: string
  cityName?: string
  cityCode?: string
  isSidebarOpen?: boolean
  setIsSidebarOpen?: (show: boolean) => void
  language: string
  TabBar?: ReactElement
}

export const Header = ({
  actionItems = [],
  sidebarItems = [],
  logoHref,
  cityName,
  cityCode,
  isSidebarOpen = false,
  setIsSidebarOpen,
  language,
  TabBar,
}: HeaderProps): ReactElement => {
  const { rect: headerRect, ref } = useElementRect()
  const height = headerRect?.height ?? 0
  const { viewportSmall } = useWindowDimensions()
  const { headerHeightSmall, headerHeightLarge } = dimensions
  const scrollHeight = viewportSmall ? headerHeightSmall : headerHeightLarge
  const landingPath = pathnameFromRouteInformation({ route: LANDING_ROUTE, languageCode: language })

  const sidebarContent = sidebarItems.map((item, index) => (
    <React.Fragment key={`menu-item-${index + 1}`}>
      {item}
      {index < sidebarItems.length - 1 && <Divider />}
    </React.Fragment>
  ))

  return (
    <Headroom scrollHeight={scrollHeight} height={height} zIndex={2}>
      <HeaderContainer ref={ref}>
        <Row>
          <HeaderLogo link={logoHref} />
          {!!cityName && <HeaderTitle title={cityName} landingPath={landingPath} />}
          <ActionBar>
            {actionItems}
            {viewportSmall && setIsSidebarOpen && !!cityCode && (
              <Sidebar
                setShow={setIsSidebarOpen}
                show={isSidebarOpen}
                Footer={<CityContentFooter city={cityCode} language={language} mode='sidebar' />}>
                {sidebarContent}
              </Sidebar>
            )}
          </ActionBar>
        </Row>
        {TabBar}
      </HeaderContainer>
    </Headroom>
  )
}

export default Header
