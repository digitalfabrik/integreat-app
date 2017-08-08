import style from './style.css'
import React from 'react'
import cx from 'classnames'

import PropTypes from 'prop-types'
import { setLanguage } from 'actions'
import { connect } from 'react-redux'
import LanguageModel from 'endpoints/models/LanguageModel'
import { isEmpty } from 'lodash/lang'

let LanguageElement = connect()(class extends React.Component {
  static propTypes = {
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
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)),
    languageCallback: PropTypes.func.isRequired,
    closeDropDownCallback: PropTypes.func,
    currentLanguage: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
    this.handleLanguageCallback = this.handleLanguageCallback.bind(this)
  }

  handleLanguageCallback (languageCode) {
    if (this.props.closeDropDownCallback) {
      this.props.closeDropDownCallback()
    }
    this.props.languageCallback(languageCode)
  }

  render () {
    return (
      <div className={style.languageFlyout}>
        {!isEmpty(this.props.languages) &&
          this.props.languages.map(language => (
              <LanguageElement
                key={language.code}
                languageCallback={this.handleLanguageCallback}
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
