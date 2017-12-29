import React from 'react'
import Headroom from 'react-headroom'
import style from './Header.css'
import logoWide from '../assets/integreat-app-logo.png'
import HeaderMenuBar, { MENU_ITEMS_PROP_TYPE } from './HeaderMenuBar'
import HeaderActionBar, { ACTION_ITEMS_PROP_TYPE } from './HeaderActionBar'

class Header extends React.Component {
  static propTypes = {
    menuItems: MENU_ITEMS_PROP_TYPE.isRequired,
    actionItems: ACTION_ITEMS_PROP_TYPE.isRequired
  }

  static defaultProps = {
    menuItems: [],
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
          <HeaderMenuBar className={style.menuBar} items={this.props.menuItems} />
        </header>
      </Headroom>
    )
  }
}

export default Header
