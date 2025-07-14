import Headroom from '@integreat-app/react-sticky-headroom'
import PersonIcon from '@mui/icons-material/Person'
import { styled } from '@mui/material/styles'
import React, { ReactElement, ReactNode } from 'react'

import dimensions from '../constants/dimensions'
import useWindowDimensions from '../hooks/useWindowDimensions'
import CityContentFooter from './CityContentFooter'
import HeaderLogo from './HeaderLogo'
import { HeaderNavigationItemProps } from './HeaderNavigationItem'
import HeaderTitle from './HeaderTitle'
import KebabMenu from './KebabMenu'
import NavigationBarScrollContainer from './NavigationBarScrollContainer'
import ChipButton from './base/ChipButton'

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
`

const HeaderSeparator = styled('div')`
  align-self: center;
  height: ${dimensions.headerHeightLarge / 2}px;
  width: 2px;
  margin: 0 5px;
  background-color: ${props => props.theme.legacy.colors.textDecorationColor};
  order: 2;

  ${props => props.theme.breakpoints.down('md')} {
    display: none;
  }
`

const ActionBar = styled('nav')`
  order: 3;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 0 16px;

  ${props => props.theme.breakpoints.down('md')} {
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

  return (
    <Headroom scrollHeight={scrollHeight} height={height} zIndex={2}>
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
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
          <ChipButton label='x-small chip' onDelete={() => console.log('click')} size='xs' icon={<PersonIcon />} />
          <ChipButton label='small chip' onDelete={() => console.log('click')} size='sm' icon={<PersonIcon />} />
          <ChipButton label='default chip' onDelete={() => console.log('click')} icon={<PersonIcon />} />
        </div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
          <ChipButton
            label='x-small chip'
            onDelete={() => console.log('click')}
            size='xs'
            variant='primary'
            icon={<PersonIcon />}
          />
          <ChipButton
            label='small chip'
            onDelete={() => console.log('click')}
            size='sm'
            variant='primary'
            icon={<PersonIcon />}
          />
          <ChipButton
            label='default chip'
            onDelete={() => console.log('click')}
            variant='primary'
            icon={<PersonIcon />}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
          <ChipButton
            label='x-small chip'
            onDelete={() => console.log('click')}
            size='xs'
            variant='outlined'
            icon={<PersonIcon />}
          />
          <ChipButton
            label='small chip'
            onDelete={() => console.log('click')}
            size='sm'
            variant='outlined'
            icon={<PersonIcon />}
          />
          <ChipButton
            label='default chip'
            onDelete={() => console.log('click')}
            variant='outlined'
            icon={<PersonIcon />}
          />
        </div>
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
