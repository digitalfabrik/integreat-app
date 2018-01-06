import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'redux-little-router'
import cx from 'classnames'
import compose from 'lodash/fp/compose'

import withFetcher from 'modules/endpoint/hocs/withFetcher'
import LANGUAGE_ENDPOINT from 'modules/endpoint/endpoints/languages'
import LanguageModel from 'modules/endpoint/models/LanguageModel'
import style from './LanguageSelector.css'

/**
 * Displays a dropDown menu to handle changing of the language
 */
export class LanguageSelector extends React.Component {
  static propTypes = {
    closeDropDownCallback: PropTypes.func.isRequired,
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)).isRequired,
    language: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    languageChangeUrls: PropTypes.object.isRequired
  }

  /**
   * Maps the given languageCode to a path to link to, which is either the languageChangeUrl from the store or,
   * if this is not given, the root categories page in the language
   * @param languageCode The languageCode
   * @return {string} The path
   */
  getPathForLanguage (languageCode) {
    return this.props.languageChangeUrls[languageCode] || `/${this.props.location}/${languageCode}`
  }

  /**
   * Maps all languages to a Link, which are linking to the same page in a different language and closing the dropDown
   * menu. For the current language we don't want to link anywhere, so we just close the dropDown menu and prevent the
   * default behaviour
   * @return {Link[]} The links for language change
   */
  getLanguageLinks () {
    const preventLink = (event) => {
      event.preventDefault()
      this.props.closeDropDownCallback()
    }

    return this.props.languages.map(language =>
      <Link
        key={language.code}
        className={cx(style.element, this.props.language === language.code ? style.elementActive : '')}
        onClick={language.code === this.props.language ? preventLink : this.props.closeDropDownCallback}
        href={this.getPathForLanguage(language.code)}>
        {language.name}
      </Link>
    )
  }

  render () {
    return (
      <div className={style.languageSelector}>
        {this.getLanguageLinks()}
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
)(LanguageSelector)
