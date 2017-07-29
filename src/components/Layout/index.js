import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import WebFont from 'webfontloader'

import Header from './Header'
import style from './style.css'
import LanguageModel from 'endpoints/models/LanguageModel'

class Layout extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)).isRequired,
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
          languages={this.props.languages}
          languageCallback={this.props.languageCallback}
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
