import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash/lang'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import withFetcher from 'modules/endpoint/hocs/withFetcher'
import LANGUAGE_ENDPOINT from 'modules/endpoint/endpoints/languages'
import LanguageModel from 'modules/endpoint/models/LanguageModel'
import style from './LanguageFlyout.css'
import cx from 'classnames'
import { Link } from 'redux-little-router'

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
        this.props.languages.map(language => <Link
            key={language.code}
            className={cx(style.element, this.props.language === language.code ? style.elementActive : '')}
            onClick={this.props.closeDropDownCallback}
            href={this.getPathForLanguage(language.code)}
          >{language.name}</Link>
        )}
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
