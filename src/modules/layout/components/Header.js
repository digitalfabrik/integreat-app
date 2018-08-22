// @flow

import * as React from 'react'
import style from './Header.css'
import logoWide from '../assets/integreat-app-logo.png'
import HeaderNavigationBar from './HeaderNavigationBar'
import HeaderActionBar from './HeaderActionBar'
import HeaderActionItem from '../HeaderActionItem'
import Link from 'redux-first-router-link'
import Headroom from '../../common/components/Headroom'
import { withTheme } from 'styled-components'
import withPlatform from '../../platform/hocs/withPlatform'
import Platform from '../../platform/Platform'
import type { Action } from 'redux-first-router'
import compose from 'lodash/fp/compose'
import type { ThemeType } from '../../app/constants/theme'

type PropsType = {
  navigationItems: React.Node,
  actionItems: Array<HeaderActionItem>,
  logoHref: Action | string,
  viewportSmall: boolean,
  theme: ThemeType,
  onStickyTopChanged: number => void,
  platform: Platform
}

/**
 * The standard header which can supplied to a Layout. Displays a logo left, a HeaderMenuBar in the middle and a
 * HeaderActionBar at the right (RTL: vice versa). On small viewports the HeaderMenuBar is shown underneath the rest
 * of the Header.
 * Uses Headroom to save space when scrolling.
 */
export class Header extends React.Component<PropsType> {
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
        <header className={style.header}>
          <div className={style.logoWide}>
            <Link to={logoHref}>
              <img src={logoWide} />
            </Link>
          </div>
          <HeaderNavigationBar className={style.navigationBar}>{navigationItems}</HeaderNavigationBar>
          <HeaderActionBar className={style.actionBar} items={actionItems} />
        </header>
      </Headroom>
    )
  }
}

export default compose(
  withPlatform,
  // $FlowFixMe https://github.com/styled-components/styled-components/issues/1785
  withTheme
)(Header)
