import React from 'react'
import { connect } from 'react-redux'

import LanguageModel from 'modules/endpoint/models/LanguageModel'
import SelectorItemModel from '../models/SelectorItemModel'
import Selector from '../components/Selector'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'
import { CATEGORIES_ROUTE, getCategoryPath } from '../../app/routes/categories'
import { EVENTS_ROUTE, getEventPath } from '../../app/routes/events'
import { EXTRAS_ROUTE, getExtraPath } from '../../app/routes/extras'
import { DISCLAIMER_ROUTE, getDisclaimerPath } from '../../app/routes/disclaimer'
import { getSearchPath, SEARCH_ROUTE } from '../../app/routes/search'
import EventModel from '../../endpoint/models/EventModel'
import HeaderLanguageSelectorItem from '../../layout/components/HeaderLanguageSelectorItem'

import type { Location } from 'redux-first-router/dist/flow-types'
import type { State } from '../../../flowTypes'

type Props = {
  languages: Array<LanguageModel>,
  location: Location,
  categories: CategoriesMapModel,
  events: Array<EventModel>,
  isHeaderActionItem: boolean
}

/**
 * Displays a dropDown menu to handle changing of the language
 */
export class LanguageSelector extends React.Component<Props> {
  /**
   * Maps the given languageCode to an action to go to the current route in the language specified by languageCode
   */
  static getLanguageChangePath (params: {| location: Location, categories: CategoriesMapModel,
    events: Array<EventModel>, languageCode: string |}) {
    const {location, categories, events, languageCode} = params
    const {city, eventId, extraAlias, language} = location.payload
    const routeType = location.type

    switch (routeType) {
      case CATEGORIES_ROUTE:
        if (categories) {
          const category = categories.findCategoryByPath(location.pathname)
          if (category && category.id !== 0) {
            const path = category.availableLanguages.get(languageCode)
            if (path) {
              return path
            } else if (language === languageCode) {
              return location.pathname
            } else {
              return null
            }
          }
        }
        return getCategoryPath(city, languageCode)
      case EVENTS_ROUTE:
        if (events && eventId) {
          const event = events.find(_event => _event.id === eventId)
          if (event) {
            return getEventPath(city, languageCode, event.availableLanguages[languageCode])
          }
        }
        return getEventPath(city, languageCode)
      case EXTRAS_ROUTE:
        return getExtraPath(city, languageCode, extraAlias)
      case DISCLAIMER_ROUTE:
        return getDisclaimerPath(city, languageCode)
      case SEARCH_ROUTE:
        return getSearchPath(city, languageCode)
    }
  }

  getSelectorItemModels (): Array<SelectorItemModel> {
    const {categories, events, location, languages} = this.props
    return languages && languages
      .map(language =>
        new SelectorItemModel({
          code: language.code,
          name: language.name,
          href: LanguageSelector.getLanguageChangePath({categories, events, location, languageCode: language.code})
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

const mapStateToProps = (state: State) => ({
  location: state.location,
  languages: state.languages.data,
  categories: state.categories.data,
  events: state.events.data
})

export default connect(mapStateToProps)(LanguageSelector)
