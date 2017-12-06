import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import WebFont from 'webfontloader'
import style from './style.css'
import i18next from 'i18next'

class Layout extends React.Component {
  static propTypes = {
    className: PropTypes.string
  }

  componentWillMount () {
    switch (i18next.language) {
      case 'ar':
      case 'fa':
      case 'ku': {
        WebFont.load({
          google: {
            families: ['Lateef:400']
          }
        })
        break
      }
      case 'ti': {
        WebFont.load({
          google: {
            families: ['El Messiri:300,400,700']
          }
        })
        break
      }
      default: {
        WebFont.load({
          google: {
            families: ['Raleway:300,400,400i,600,700,700i', 'Open+Sans:400']
          }
        })
      }
    }
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
