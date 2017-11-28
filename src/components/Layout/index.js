import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import WebFont from 'webfontloader'
import style from './style.css'

class Layout extends React.Component {
  static propTypes = {
    className: PropTypes.string
  }

  componentWillMount () {
    WebFont.load({
      google: {
        families: ['El Messiri:300,400,700', 'Raleway:300,400,400i,600,700,700i,800']
      }
    })
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
