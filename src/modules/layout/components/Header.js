// @flow

import * as React from 'react'
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
import buildConfig from '../../app/constants/buildConfig'

type PropsType = {|
  navigationItems: React.Node,
  actionItems: Array<HeaderActionItem>,
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
  align-items: stretch;

  box-shadow: 0 2px 5px -3px rgba(0, 0, 0, 0.2);
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  user-select: none;
  flex-direction: column;

  & > div {
    display: flex;
    height: ${props => props.theme.dimensions.headerHeightLarge}px;
  }

  @media ${props => props.theme.dimensions.smallViewport} {
    & > div {
      justify-content: space-between;
      flex-wrap: wrap;
    }

    & > div > div {
      height: ${props => props.theme.dimensions.headerHeightSmall}px;
    }
  }

  @media ${props => props.theme.dimensions.minMaxWidth} {
    padding-right: calc((200% - 100vw - ${props => props.theme.dimensions.maxWidth}px) / 2);
    padding-left: calc((100vw - ${props => props.theme.dimensions.maxWidth}px) / 2);
  }
`

const CityName = styled.div`
  display: flex;
  align-items: center;
  font-size: ${props => props.long ? '1.5rem' : '1.8rem'};
  font-weight: 800;
  flex: 1;
  order: 2;

  & span {
    padding-left: 5px;
    padding-bottom: 10px;
  }

  @media ${props => props.theme.dimensions.smallViewport} {
    font-size: 1.2rem;
    order: 3;
    min-width: 100%;
    justify-content: center;

    & span {
      padding-bottom: 0px;
    }
  }
`

const LogoWide = styled.div`
  box-sizing: border-box;
  flex-shrink: 1;
  height: 100%;
  padding: 0 10px;
  display: flex;
  align-items: center;
  order: 1;

  & a {
    width: 100%;
    height: 60%;
  }

  & img {
    max-width: 100%;
    max-height: 100%;
  }

  @media ${props => props.theme.dimensions.smallViewport} {
    & a {
      max-height: 75%;
    }
  }
`

const Row = styled.div`
  display: flex;
  flex: 1;
  max-width: 100%;
  overflow-x: auto;
  height: ${props => props.theme.dimensions.headerHeightLarge}px;
  flex-direction: row;
`

const ActionBar = styled(HeaderActionBar)`
  flex-shrink: 1;
  order: 3;

  @media ${props => props.theme.dimensions.smallViewport} {
    order: 2;
  }
`

const NavigationBar = styled(HeaderNavigationBar)`
    padding: 0 10px;
    flex-grow: 1;
    flex-shrink: 0;
    align-items: stretch;
    justify-content: center;
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
    const {
      theme, viewportSmall, onStickyTopChanged, actionItems, logoHref, navigationItems, platform, cityName
    } = this.props
    const { headerHeightSmall, headerHeightLarge } = theme.dimensions
    const height = viewportSmall ? 3 * headerHeightSmall : 2 * headerHeightLarge
    const scrollHeight = viewportSmall ? 2 * headerHeightSmall : headerHeightLarge
    return (
      <Headroom onStickyTopChanged={onStickyTopChanged}
                scrollHeight={scrollHeight}
                height={height}
                positionStickyDisabled={platform.positionStickyDisabled}>
        <HeaderContainer>
          <Row>
            <LogoWide>
              <Link to={logoHref}>
                <img src={buildConfig.logoWide} alt={`Integreat${cityName ? ` - ${cityName}` : ''}`} />
              </Link>
            </LogoWide>
            <CityName long={cityName?.length >= 25}><span>{cityName}</span></CityName>
            <ActionBar items={actionItems} />
          </Row>
          <Row>
            <NavigationBar>{navigationItems}</NavigationBar>
          </Row>
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
