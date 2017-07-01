import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import WebFont from 'webfontloader'

import Header from './Header'
import style from './Layout.css'
import Navigation from './Navigation'
import Payload from 'payload'

class Layout extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    navigation: PropTypes.instanceOf(Navigation).isRequired,
    languagePayload: PropTypes.instanceOf(Payload).isRequired,
    currentLanguage: PropTypes.string.isRequired,
    languageCallback: PropTypes.func,
    noHeader: PropTypes.bool
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
        {!this.props.noHeader &&
        <Header
          languageCallback={this.props.languageCallback}
          languages={this.props.languagePayload.data || []}
          navigation={this.props.navigation || (() => {})}
          currentLanguage={this.props.currentLanguage}
        />
        }
        <main className={cx(style.topSpacing, style.layout)}>
          <div className={cx(style.content, this.props.className)}>{this.props.children}</div>
        </main>
      </div>
    )
  }
}

export default Layout
