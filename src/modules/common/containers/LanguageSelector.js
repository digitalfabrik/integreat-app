import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import LanguageModel from 'modules/endpoint/models/LanguageModel'
import SelectorItemModel from '../models/SelectorItemModel'
import Selector from '../components/Selector'

/**
 * Displays a dropDown menu to handle changing of the language
 */
export class LanguageSelector extends React.Component {
  static propTypes = {
    closeDropDownCallback: PropTypes.func,
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)).isRequired,
    language: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    languageChangeUrls: PropTypes.object.isRequired,
    verticalLayout: PropTypes.bool
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

  getSelectorItemModels () {
    return this.props.languages.map(language =>
      new SelectorItemModel({code: language.code, name: language.name, path: this.getPathForLanguage(language.code)})
    )
  }

  render () {
    return (
      <Selector verticalLayout={this.props.verticalLayout}
                items={this.getSelectorItemModels()}
                activeItemCode={this.props.language}
                closeDropDownCallback={this.props.closeDropDownCallback} />
    )
  }
}

const mapStateToProps = state => ({
  language: state.router.params.language,
  location: state.router.params.location,
  languageChangeUrls: state.languageChangeUrls
})

export default connect(mapStateToProps)(LanguageSelector)
