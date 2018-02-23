import React from 'react'
import PropTypes from 'prop-types'
import style from './Header.css'
import logoWide from '../assets/integreat-app-logo.png'
import HeaderNavigationBar from '../components/HeaderNavigationBar'
import HeaderActionBar from '../components/HeaderActionBar'
import HeaderActionItem from '../HeaderActionItem'
import HeaderNavigationItem from '../HeaderNavigationItem'
import Headroom from '../../common/components/Headroom'
import { connect } from 'react-redux'
import { Link } from 'redux-little-router'

const HEADER_HEIGHT_LARGE = 85
const HALF_HEADER_HEIGHT_SMALL = 55

/**
 * The standard header which can supplied to a Layout. Displays a logo left, a HeaderMenuBar in the middle and a
 * HeaderActionBar at the right (RTL: vice versa). On small viewports the HeaderMenuBar is shown underneath the rest
 * of the Header.
 * Uses Headroom to save space when scrolling.
 */
export class Header extends React.Component {
  static propTypes = {
    navigationItems: PropTypes.arrayOf(PropTypes.instanceOf(HeaderNavigationItem)).isRequired,
    actionItems: PropTypes.arrayOf(PropTypes.instanceOf(HeaderActionItem)).isRequired,
    smallViewport: PropTypes.bool.isRequired,
    logoHref: PropTypes.string.isRequired
  }

  static defaultProps = {
    navigationItems: [],
    actionItems: []
  }

  render () {
    const scrollHeight = this.props.smallViewport ? HALF_HEADER_HEIGHT_SMALL : HEADER_HEIGHT_LARGE
    return (
      <Headroom scrollHeight={scrollHeight}>
        <header className={style.header}>
          <div className={style.logoWide}>
            <Link href={this.props.logoHref}>
              <img src={logoWide} />
            </Link>
          </div>
          <HeaderActionBar className={style.actionBar} items={this.props.actionItems} />
          <HeaderNavigationBar className={style.navigationBar} items={this.props.navigationItems} />
        </header>
      </Headroom>
    )
  }
}

const mapStateToProps = state => ({smallViewport: state.viewport.is.small})
export default connect(mapStateToProps)(Header)
