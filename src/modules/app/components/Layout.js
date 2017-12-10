import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import style from './Layout.css'

class Layout extends React.Component {
  static propTypes = {
    className: PropTypes.string
  }

  render () {
    return (
      <main className={cx(style.topSpacing, style.layout)}>
        <div className={cx(style.content, this.props.className)}>{this.props.children}</div>
      </main>
    )
  }
}

export default Layout
