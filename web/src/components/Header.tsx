import Headroom from '@integreat-app/react-sticky-headroom'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import React, { ReactElement, ReactNode } from 'react'

import { LANDING_ROUTE, pathnameFromRouteInformation } from 'shared'

import useElementRect from '../hooks/useElementRect'
import HeaderLogo from './HeaderLogo'
import HeaderTitle from './HeaderTitle'

const HEADER_HEIGHT = 80

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
  min-height: ${HEADER_HEIGHT}px;
  justify-content: space-between;
  flex-wrap: wrap;
  overflow-x: auto;
  padding: 0 16px;

  ${props => props.theme.breakpoints.down('md')} {
    padding: 0 8px;
  }
`

const ActionBar = styled('nav')`
  order: 3;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;

  ${props => props.theme.breakpoints.down('md')} {
    order: 2;
  }
`

type HeaderProps = {
  actionItems: ReactNode[]
  logoHref: string
  cityName?: string
  language: string
  TabBar?: ReactNode
}

export const Header = ({ actionItems = [], logoHref, cityName, language, TabBar }: HeaderProps): ReactElement => {
  const { rect: headerRect, ref } = useElementRect()
  const height = headerRect?.height ?? 0
  const landingPath = pathnameFromRouteInformation({ route: LANDING_ROUTE, languageCode: language })

  return (
    <Headroom scrollHeight={HEADER_HEIGHT} height={height} zIndex={2}>
      <Paper>
        <HeaderContainer ref={ref}>
          <Row>
            <Stack direction='row-reverse'>
              <HeaderLogo link={logoHref} />
              {!!cityName && <HeaderTitle title={cityName} landingPath={landingPath} />}
            </Stack>
            <ActionBar>{actionItems}</ActionBar>
          </Row>
          {TabBar}
        </HeaderContainer>
      </Paper>
    </Headroom>
  )
}

export default Header
