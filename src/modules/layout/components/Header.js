import React from 'react'
import PropTypes from 'prop-types'
import style from './Header.css'
import logoWide from '../assets/integreat-app-logo.png'
import HeaderNavigationBar from './HeaderNavigationBar'
import HeaderActionBar from './HeaderActionBar'
import HeaderActionItem from '../HeaderActionItem'
import HeaderNavigationItem from '../HeaderNavigationItem'
import { Link } from 'redux-little-router'
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
    navigationItems: PropTypes.arrayOf(PropTypes.instanceOf(HeaderNavigationItem)).isRequired,
    actionItems: PropTypes.arrayOf(PropTypes.instanceOf(HeaderActionItem)).isRequired,
    logoHref: PropTypes.string.isRequired,
    viewportSmall: PropTypes.bool.isRequired
  }

  static defaultProps = {
    navigationItems: [],
    actionItems: []
  }

  render () {
    const scrollHeight = this.props.viewportSmall ? HALF_HEADER_HEIGHT_SMALL : HEADER_HEIGHT_LARGE
    return (
      <Headroom scrollHeight={scrollHeight}>
        <header className={style.header}>
          <div className={style.logoWide}>
            <Link href={this.props.logoHref}>
              <img src={logoWide} />
            </Link>
          </div>
          <HeaderNavigationBar className={style.navigationBar} items={this.props.navigationItems} />
          <HeaderActionBar className={style.actionBar} items={this.props.actionItems} />
        </header>
      </Headroom>
    )
  }
}

export default Header
