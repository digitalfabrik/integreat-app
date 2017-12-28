import React from 'react'
import PropTypes from 'prop-types'
import Headroom from 'react-headroom'
import style from './Header.css'
import logoWide from '../assets/integreat-app-logo.png'
import HeaderMenuBar from './HeaderMenuBar'
import HeaderActionBar from './HeaderActionBar'

class Header extends React.Component {
  static propTypes = {
    menuItems: PropTypes.arrayOf(PropTypes.shape({
      href: PropTypes.string.isRequired, active: PropTypes.bool.isRequired, text: PropTypes.string.isRequired
    })).isRequired,
    actionItems: PropTypes.arrayOf(PropTypes.shape({
      iconSrc: PropTypes.string.isRequired,
      href: PropTypes.string,
      dropDownNode: PropTypes.node
    })).isRequired
  }

  static defaultProps = {
    menuItems: [],
    actionItems: []
  }

  render () {
    return (
      <Headroom>
        <div className={style.header}>
          <div className={style.logoWide}>
            <img src={logoWide} />
          </div>
          <HeaderActionBar items={this.props.actionItems} />
          <HeaderMenuBar className={style.menuBar} items={this.props.menuItems} />
        </div>
      </Headroom>
    )
  }
}

export default Header
