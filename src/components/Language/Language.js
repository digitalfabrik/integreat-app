import React from 'react'
import PropTypes from 'prop-types'
import { LanguageModel } from 'endpoints/language'

import style from './Language.css'

class LanguageElement extends React.Component {
  static propTypes = {
    language: PropTypes.instanceOf(LanguageModel).isRequired
  }

  render () {
    return <div className={style.element}>{this.props.language.name}</div>
  }
}

export default class Language extends React.Component {
  static propTypes = {
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)).isRequired
  }

  render () {
    return <div>{this.props.languages.map(language => <LanguageElement language={language}/>)}</div>
  }
}
