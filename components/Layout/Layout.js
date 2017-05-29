import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Header from './Header'
import style from './Layout.css'
import Navigation from './Navigation'
import { LanguageModel } from '../../src/endpoints/language'

class Layout extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    navigation: PropTypes.instanceOf(Navigation).isRequired,
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)).isRequired,
    languageCallback: PropTypes.func.isRequired
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
