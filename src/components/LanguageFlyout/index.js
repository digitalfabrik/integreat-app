import style from './style.css'
import React from 'react'
import cx from 'classnames'

import PropTypes from 'prop-types'
import { setLanguage } from 'actions'
import { connect } from 'react-redux'
import LanguageModel from 'endpoints/models/LanguageModel'

let LanguageElement = connect()(class extends React.Component {
  static propTypes = {
    flyout: PropTypes.any.isRequired,
    language: PropTypes.instanceOf(LanguageModel).isRequired,
    languageCallback: PropTypes.func,
    active: PropTypes.bool.isRequired
  }

  constructor (props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    let languageCode = this.props.language.code
    this.props.dispatch(setLanguage(languageCode))
    this.props.languageCallback(languageCode)
  }

  render () {
    return (
      <div
        className={cx(style.element, this.props.active ? style.elementActive : '')}
        onClick={this.handleClick}>
        {this.props.language.name}
      </div>
    )
  }
})

export default class LanguageFlyout extends React.Component {
  static propTypes = {
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)).isRequired,
    languageCallback: PropTypes.func.isRequired,
    currentLanguage: PropTypes.string.isRequired
  }

  render () {
    return (
      <div className={style.languageFlyout}>
        {
          this.props.languages.map(language => (
              <LanguageElement
                key={language.code}
                flyout={this}
                languageCallback={this.props.languageCallback}
                active={this.props.currentLanguage === language.code}
                language={language}
              />
            )
          )
        }
      </div>
    )
  }
}
