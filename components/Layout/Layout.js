import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Header from './Header'
import s from './Layout.css'
import Navigation from './Navigation'

class Layout extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    navigation: PropTypes.instanceOf(Navigation).isRequired
  }

  render () {
    return (
      <div>
        <Header navigation={this.props.navigation}/>
        <main className={s.topSpacing}>
          <div className={cx(s.content, this.props.className)}>{this.props.children}</div>
        </main>
      </div>
    )
  }
}

export default Layout
