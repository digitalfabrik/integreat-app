import PropTypes from 'prop-types'
import LanguageModel from '../../endpoint/models/LanguageModel'
import React from 'react'
import cx from 'classnames'
import { Link } from 'redux-little-router'

import style from '../containers/LanguageFlyout.css'

class LanguageFlyoutElement extends React.Component {
  static propTypes = {
    language: PropTypes.instanceOf(LanguageModel).isRequired,
    active: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    onClick: PropTypes.func
  }

  render () {
    return (
      <Link
        href={this.props.active ? '#' : this.props.path}
        className={cx(style.element, this.props.active ? style.elementActive : '')}
        onClick={this.props.onClick}>
        {this.props.language.name}
      </Link>
    )
  }
}

export default LanguageFlyoutElement
