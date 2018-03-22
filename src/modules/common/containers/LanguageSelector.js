import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import LanguageModel from 'modules/endpoint/models/LanguageModel'
import SelectorItemModel from '../models/SelectorItemModel'
import Selector from '../components/Selector'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'
import { CATEGORIES_ROUTE, goToCategories } from '../../app/routes/categories'
import { goToCategoriesRedirect } from '../../app/routes/categoriesRedirect'
import { EVENTS_ROUTE, goToEvents } from '../../app/routes/events'
import { EXTRAS_ROUTE, goToExtras } from '../../app/routes/extras'
import { DISCLAIMER_ROUTE, goToDisclaimer } from '../../app/routes/disclaimer'
import { goToSearch, SEARCH_ROUTE } from '../../app/routes/search'
import Caption from '../components/Caption'
import { NOT_FOUND } from 'redux-first-router'

/**
 * Displays a dropDown menu to handle changing of the language
 */
export class LanguageSelector extends React.Component {
  static propTypes = {
    closeDropDownCallback: PropTypes.func,
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)).isRequired,
    location: PropTypes.object.isRequired,
    verticalLayout: PropTypes.bool,
    categories: PropTypes.instanceOf(CategoriesMapModel),
    title: PropTypes.string
  }

  /**
   * Maps the given languageCode to a path to link to, which is either the languageChangeUrl from the store or,
   * if this is not given, the root categories page in the language
   * @param languageCode The languageCode
   * @return {string} The path
   */
  getLanguageChangeAction (languageCode) {
    const {location, categories} = this.props
    const {city, eventId, extraAlias} = location.payload
    const routeType = location.type

    switch (routeType) {
      case CATEGORIES_ROUTE:
        if (categories) {
          const category = categories.getCategoryByUrl(location.pathname)
          if (category && category.id !== 0) {
            return goToCategoriesRedirect(city, languageCode, `${category.availableLanguages[languageCode]}`)
          }
        }
        break
      case EVENTS_ROUTE:
        return goToEvents(city, languageCode, eventId)
      case EXTRAS_ROUTE:
        return goToExtras(city, languageCode, extraAlias)
      case DISCLAIMER_ROUTE:
        return goToDisclaimer(city, languageCode)
      case SEARCH_ROUTE:
        return goToSearch(city, languageCode)
      case NOT_FOUND:
        return goToCategories(location.prev.payload.city, languageCode)
    }
    return goToCategories(city, languageCode)
  }

  getSelectorItemModels () {
    return this.props.languages.map(language =>
      new SelectorItemModel({
        code: language.code, name: language.name, href: this.getLanguageChangeAction(language.code)
      })
    )
  }

  render () {
    const {location, verticalLayout, closeDropDownCallback, title} = this.props
    const selectorItemModels = this.getSelectorItemModels()

    return <React.Fragment>
      {verticalLayout && title && <Caption title={title} />}
      {selectorItemModels && <Selector verticalLayout={verticalLayout}
                  items={this.getSelectorItemModels()}
                  activeItemCode={location.payload.language}
                  closeDropDownCallback={closeDropDownCallback} />}
      </React.Fragment>
  }
}

const mapStateToProps = state => ({
  location: state.location,
  languages: state.languages.data,
  categories: state.categories.data,
  cities: state.cities.data
})

export default connect(mapStateToProps)(LanguageSelector)
