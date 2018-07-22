import React from 'react'
import PropTypes from 'prop-types'
import style from './Header.css'
import logoWide from '../../assets/integreat-app-logo.png'
import HeaderNavigationBar from './HeaderNavigationBar'
import HeaderActionBar from './HeaderActionBar'
import HeaderActionItem from '../../HeaderActionItem'
import Link from 'redux-first-router-link'
import Headroom from '../../../common/components/Headroom'
import { withTheme } from 'styled-components'
import withPlatform from '../../../platform/hocs/withPlatform'
import Platform from '../../../platform/Platform'
import { compose } from 'redux'

/**
 * The standard header which can supplied to a Layout. Displays a logo left, a HeaderMenuBar in the middle and a
 * HeaderActionBar at the right (RTL: vice versa). On small viewports the HeaderMenuBar is shown underneath the rest
 * of the Header.
 * Uses Headroom to save space when scrolling.
 */
export class Header extends React.Component {
  static propTypes = {
    navigationItems: PropTypes.node,
    actionItems: PropTypes.arrayOf(PropTypes.instanceOf(HeaderActionItem)).isRequired,
    logoHref: PropTypes.object.isRequired,
    viewportSmall: PropTypes.bool.isRequired,
    theme: PropTypes.object.isRequired,
    onStickyTopChanged: PropTypes.func,
    platform: PropTypes.instanceOf(Platform)
  }

  static defaultProps = {
    navigationItems: null,
    actionItems: []
  }

  render () {
    const {headerHeightSmall, headerHeightLarge} = this.props.theme.dimensions
    const height = this.props.viewportSmall ? headerHeightSmall : headerHeightLarge
    const scrollHeight = this.props.viewportSmall ? headerHeightSmall : headerHeightLarge
    return (
      <Headroom onStickyTopChanged={this.props.onStickyTopChanged} scrollHeight={scrollHeight} height={height}
                positionStickyDisabled={this.props.platform.positionStickyDisabled}>
        <header className={style.header}>
          <div className={style.logoWide}>
            <Link to={this.props.logoHref}>
              <img src={logoWide} />
            </Link>
          </div>
          <HeaderNavigationBar className={style.navigationBar}>{this.props.navigationItems}</HeaderNavigationBar>
          <HeaderActionBar className={style.actionBar} items={this.props.actionItems} />
        </header>
      </Headroom>
    )
  }
}

export default compose(
  withTheme,
  withPlatform
)(Header)
