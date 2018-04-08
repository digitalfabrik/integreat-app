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
import HeaderLanguageSelectorItem from '../../layout/components/HeaderLanguageSelectorItem'

/**
 * Displays a dropDown menu to handle changing of the language
 */
export class LanguageSelector extends React.Component {
  static propTypes = {
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)),
    location: PropTypes.object.isRequired,
    categories: PropTypes.instanceOf(CategoriesMapModel),
    events: PropTypes.arrayOf(PropTypes.instanceOf(EventModel)),
    isHeaderActionItem: PropTypes.bool.isRequired
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
            const categoryCode = category.availableLanguages[languageCode]
            if (categoryCode) {
              return goToCategoriesRedirect(city, languageCode, categoryCode)
            } else {
              return
            }
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
    const languages = this.props.languages
    return languages && languages
      .map(language =>
        new SelectorItemModel({
          code: language.code, name: language.name, href: this.getLanguageChangeAction(language.code)
        })
      )
      .filter(selectorItem => selectorItem.href)
  }

  render () {
    const {location, isHeaderActionItem} = this.props
    const selectorItems = this.getSelectorItemModels()
    const activeItemCode = location.payload.language

    if (isHeaderActionItem) {
      return <HeaderLanguageSelectorItem selectorItems={selectorItems} activeItemCode={activeItemCode} />
    } else {
      return selectorItems && <Selector verticalLayout
                                        items={selectorItems}
                                        activeItemCode={activeItemCode} />
    }
  }
}

const mapStateToProps = state => ({
  location: state.location,
  languages: state.languages.data,
  categories: state.categories.data,
  events: state.events.data
})

export default connect(mapStateToProps)(LanguageSelector)
