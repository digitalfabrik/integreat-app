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
import EventModel from '../../endpoint/models/EventModel'

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
    events: PropTypes.arrayOf(PropTypes.instanceOf(EventModel))
  }

  /**
   * Maps the given languageCode to an action to go to the current route in the language specified by languageCode
   * @param languageCode
   * @return {*}
   */
  getLanguageChangeAction (languageCode) {
    const {location, categories, events} = this.props
    const {city, eventId, extraAlias} = location.payload
    const routeType = location.type

    switch (routeType) {
      case CATEGORIES_ROUTE:
        if (categories) {
          const category = categories.findCategoryByUrl(location.pathname)
          if (category && category.id !== 0) {
            return goToCategoriesRedirect(city, languageCode, `${category.availableLanguages[languageCode]}`)
          }
        }
        return goToCategories(city, languageCode)
      case EVENTS_ROUTE:
        if (events && eventId) {
          const event = events.find(_event => _event.id === eventId)
          if (event) {
            return goToEvents(city, languageCode, event.availableLanguages[languageCode])
          }
        }
        return goToEvents(city, languageCode)
      case EXTRAS_ROUTE:
        return goToExtras(city, languageCode, extraAlias)
      case DISCLAIMER_ROUTE:
        return goToDisclaimer(city, languageCode)
      case SEARCH_ROUTE:
        return goToSearch(city, languageCode)
    }
  }

  getSelectorItemModels () {
    return this.props.languages.map(language =>
      new SelectorItemModel({
        code: language.code, name: language.name, href: this.getLanguageChangeAction(language.code)
      })
    )
  }

  render () {
    const {location, verticalLayout, closeDropDownCallback} = this.props
    const selectorItemModels = this.getSelectorItemModels()

    return <React.Fragment>
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
  events: state.events.data
})

export default connect(mapStateToProps)(LanguageSelector)
