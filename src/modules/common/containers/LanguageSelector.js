import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import LanguageModel from 'modules/endpoint/models/LanguageModel'
import SelectorItemModel from '../models/SelectorItemModel'
import Selector from '../components/Selector'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'

/**
 * Displays a dropDown menu to handle changing of the language
 */
export class LanguageSelector extends React.Component {
  static propTypes = {
    closeDropDownCallback: PropTypes.func,
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)).isRequired,
    router: PropTypes.object.isRequired,
    verticalLayout: PropTypes.bool,
    categories: PropTypes.instanceOf(CategoriesMapModel)
  }

  /**
   * Maps the given languageCode to a path to link to, which is either the languageChangeUrl from the store or,
   * if this is not given, the root categories page in the language
   * @param languageCode The languageCode
   * @return {string} The path
   */
  getLanuageChangeAction (languageCode) {
    const router = this.props.router
    const routeType = router.type
    const categories = this.props.categories

    switch (routeType) {
      case 'CATEGORIES':
        if (categories) {
          const category = categories.getCategoryByUrl(router.pathname)
          return {type: 'CATEGORIES_REDIRECT', payload: {city: router.payload.city, language: languageCode, categoryId: `${category.availableLanguages[languageCode]}`}}
        }
        return
      case 'EVENTS':
        return {type: 'EVENTS', payload: {...router.payload, language: languageCode}}
      case 'EXTRAS':
        return {type: 'EXTRAS', payload: {...router.payload, language: languageCode}}
      case 'DISCLAIMER':
        return {type: 'DISCLAIMER', payload: {...router.payload, language: languageCode}}
      case 'SEARCH':
        return {type: 'SEARCH', payload: {...router.payload, language: languageCode}}
    }
  }

  getSelectorItemModels () {
    return this.props.languages.map(language =>
      new SelectorItemModel({
        code: language.code, name: language.name, href: this.getLanuageChangeAction(language.code)
      })
    )
  }

  render () {
    return (
      <Selector verticalLayout={this.props.verticalLayout}
                items={this.getSelectorItemModels()}
                activeItemCode={this.props.router.payload.language}
                closeDropDownCallback={this.props.closeDropDownCallback} />
    )
  }
}

const mapStateToProps = state => ({
  router: state.location,
  languages: state.languages,
  categories: state.categories
})

export default connect(mapStateToProps)(LanguageSelector)
