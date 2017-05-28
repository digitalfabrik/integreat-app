import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Header from './Header'
import s from './Layout.css'

class Layout extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    languageTo: PropTypes.string.isRequired
  }

  render () {
    return (
      <div>
        <Header languageTo={this.props.languageTo}/>
        <main className={s.topSpacing}>
          <div className={cx(s.content, this.props.className)}>{this.props.children}</div>
        </main>
      </div>
    )
  }
}

export default Layout
