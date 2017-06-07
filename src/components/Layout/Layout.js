import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import WebFont from 'webfontloader'

import Header from './Header'
import style from './Layout.css'
import Navigation from './Navigation'
import { LanguageModel } from '../../endpoints/language'

class Layout extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    navigation: PropTypes.instanceOf(Navigation).isRequired,
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)).isRequired,
    languageCallback: PropTypes.func.isRequired
  }

  componentWillMount () {
    WebFont.load({
      google: {
        families: ['El Messiri:300,400,700', 'Raleway:300,400,400i,700,700i']
      }
    })
  }

  render () {
    return (
      <div>
        <Header
          languageCallback={this.props.languageCallback}
          languages={this.props.languages}
          navigation={this.props.navigation}
        />
        <main className={cx(style.topSpacing, style.layout)}>
          <div className={cx(style.content, this.props.className)}>{this.props.children}</div>
        </main>
      </div>
    )
  }
}

export default Layout
