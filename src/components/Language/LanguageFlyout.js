import style from './LanguageFlyout.css'
import React from 'react'
import cx from 'classnames'

import PropTypes from 'prop-types'
import { LanguageModel } from 'endpoints/language'

class LanguageElement extends React.Component {
  static propTypes = {
    flyout: PropTypes.any.isRequired,
    language: PropTypes.instanceOf(LanguageModel).isRequired,
    languageCallback: PropTypes.func.isRequired,
    active: PropTypes.bool.isRequired
  }

  constructor (props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.props.languageCallback(this.props.language.code)
    this.props.flyout.toggle()
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
}

export default class LanguageFlyout extends React.Component {
  static propTypes = {
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)).isRequired,
    languageCallback: PropTypes.func.isRequired,
    currentLanguage: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {open: false}
  }

  toggle () {
    this.setState({open: !this.state.open})
    return this.state.open
  }

  render () {
    return (
      <div className={cx(style.languageFlyout, this.state.open ? style.languageFlyoutShow : '')}>
          {this.props.languages.map(language => <LanguageElement
            key={language.code}
            flyout={this}
            languageCallback={this.props.languageCallback}
            active={this.props.currentLanguage === language.code}
            language={language}/>)}
        </div>
    )
  }
}
