import React from 'react'
import PropTypes from 'prop-types'
import style from './Header.css'
import logoWide from '../assets/integreat-app-logo.png'
import HeaderNavigationBar from './HeaderNavigationBar'
import HeaderActionBar from './HeaderActionBar'
import HeaderActionItem from '../HeaderActionItem'
import Link from 'redux-first-router-link'
import { HALF_HEADER_HEIGHT_SMALL, HEADER_HEIGHT_LARGE } from '../constants'
import Headroom from '../../common/components/Headroom'

/**
 * The standard header which can supplied to a Layout. Displays a logo left, a HeaderMenuBar in the middle and a
 * HeaderActionBar at the right (RTL: vice versa). On small viewports the HeaderMenuBar is shown underneath the rest
 * of the Header.
 * Uses Headroom to save space when scrolling.
 */
class Header extends React.Component {
  static propTypes = {
    navigationItems: PropTypes.node,
    actionItems: PropTypes.arrayOf(PropTypes.instanceOf(HeaderActionItem)).isRequired,
    logoHref: PropTypes.object.isRequired,
    viewportSmall: PropTypes.bool.isRequired
  }

  static defaultProps = {
    navigationItems: null,
    actionItems: []
  }

  render () {
    const scrollHeight = this.props.viewportSmall ? HALF_HEADER_HEIGHT_SMALL : HEADER_HEIGHT_LARGE
    return (
      <Headroom scrollHeight={scrollHeight}>
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

export default Header
