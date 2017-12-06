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
    const arabicFonts = ['Lateef:400']
    const latinFonts = ['Raleway:300,400,400i,600,700,700i', 'Open+Sans:400']
    const families = {
      de: latinFonts,
      ar: arabicFonts,
      fa: arabicFonts,
      ku: arabicFonts,
      ti: ['El Messiri:300,400,700']
    }

    WebFont.load({
      google: {
        families: families[i18next.language] || latinFonts
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
