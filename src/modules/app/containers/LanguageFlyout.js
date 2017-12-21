import React from 'react'
import cx from 'classnames'

import PropTypes from 'prop-types'
import { isEmpty } from 'lodash/lang'
import { connect } from 'react-redux'
import {Link} from 'redux-little-router'
import compose from 'lodash/fp/compose'

import withFetcher from 'modules/endpoint/hocs/withFetcher'
import LANGUAGE_ENDPOINT from 'modules/endpoint/endpoints/languages'
import LanguageModel from 'modules/endpoint/models/LanguageModel'

import style from './LanguageFlyout.css'

class LanguageElement extends React.Component {
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

class LanguageFlyout extends React.Component {
  static propTypes = {
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)),
    closeDropDownCallback: PropTypes.func,
    language: PropTypes.string,
    languageChangeUrls: PropTypes.object.isRequired
  }

  getPathForLanguage (languageCode) {
    return this.props.languageChangeUrls[languageCode] || `/${this.props.location}/${languageCode}`
  }

  render () {
    return (
      <div className={style.languageFlyout}>
        {!isEmpty(this.props.languages) &&
        this.props.languages.map(language => (
            <LanguageElement
              key={language.code}
              onClick={this.props.closeDropDownCallback}
              active={this.props.language === language.code}
              language={language}
              path={this.getPathForLanguage(language.code)}
            />
          )
        )
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  language: state.router.params.language,
  location: state.router.params.location,
  languageChangeUrls: state.languageChangeUrls
})

export default compose(
  connect(mapStateToProps),
  withFetcher(LANGUAGE_ENDPOINT, true, true)
)(LanguageFlyout)
