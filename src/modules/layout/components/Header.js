import React from 'react'
import Headroom from 'react-headroom'
import style from './Header.css'
import logoWide from '../assets/integreat-app-logo.png'
import HeaderNavigationBar, { NAVIGATION_ITEMS_PROP_TYPE } from './HeaderNavigationBar'
import HeaderActionBar, { ACTION_ITEMS_PROP_TYPE } from './HeaderActionBar'

/**
 * The standard header which can supplied to a Layout. Displays a logo left, a HeaderMenuBar in the middle and a
 * HeaderActionBar at the right (RTL: vice versa). On small viewports the HeaderMenuBar is shown underneath the rest
 * of the Header.
 * Uses Headroom to save space when scrolling.
 */
class Header extends React.Component {
  static propTypes = {
    navigationItems: NAVIGATION_ITEMS_PROP_TYPE.isRequired,
    actionItems: ACTION_ITEMS_PROP_TYPE.isRequired
  }

  static defaultProps = {
    navigationItems: [],
    actionItems: []
  }

  render () {
    return (
      <Headroom>
        <header className={style.header}>
          <div className={style.logoWide}>
            <img src={logoWide} />
          </div>
          <HeaderActionBar className={style.actionBar} items={this.props.actionItems} />
          <HeaderNavigationBar className={style.navigationBar} items={this.props.navigationItems} />
        </header>
      </Headroom>
    )
  }
}

export default Header
