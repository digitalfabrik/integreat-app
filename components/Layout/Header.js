import React from 'react'
import Navigation from './Navigation'
import style from './Header.css'

import logo from './assets/integreat-app-logo.png'

class Header extends React.Component {
  render () {
    return (
      <header className={style.spacer}>
        <div className={style.header}>
          <div className={style.logo}>
            <img src={logo}/>
          </div>
          <div className={style.item}>
            Home
          </div>
          <div className={style.item}>
            Language
          </div>
          <div className={style.item}>
            Location
          </div>
          <Navigation/>
        </div>
      </header>
    )
  }
}

export default Header
