import * as React from 'react'
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
import CityModel from '../../endpoint/models/CityModel'

/**
 * Displays a dropDown menu to handle changing of the language
 */
export class LanguageSelector extends React.Component {
  static propTypes = {
    closeDropDownCallback: PropTypes.func,
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)),
    router: PropTypes.object.isRequired,
    verticalLayout: PropTypes.bool,
    categories: PropTypes.instanceOf(CategoriesMapModel),
    cities: PropTypes.arrayOf(PropTypes.instanceOf(CityModel))
  }

  /**
   * Maps the given languageCode to a path to link to, which is either the languageChangeUrl from the store or,
   * if this is not given, the root categories page in the language
   * @param languageCode The languageCode
   * @return {string} The path
   */
  getLanguageChangeAction (languageCode) {
    const {router, categories} = this.props
    const {city, eventId, extraAlias} = router.payload
    const routeType = router.type

    switch (routeType) {
      case CATEGORIES_ROUTE:
        if (categories) {
          const category = categories.getCategoryByUrl(router.pathname)
          if (category && category.id !== 0) {
            return goToCategoriesRedirect(city, languageCode, `${category.availableLanguages[languageCode]}`)
          }
        }
        return goToCategories(city, languageCode)
      case EVENTS_ROUTE:
        return goToEvents(city, languageCode, eventId)
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
    return languages && this.props.languages.map(language =>
      new SelectorItemModel({
        code: language.code, name: language.name, href: this.getLanguageChangeAction(language.code)
      })
    )
  }

  getCityName () {
    const {router, cities} = this.props
    return cities && cities.find(_city => _city.code === router.payload.city)
  }

  render () {
    const {router, verticalLayout, closeDropDownCallback} = this.props
    const selectorItemModels = this.getSelectorItemModels()
    const title = this.getCityName()

    return <React.Fragment>
      {verticalLayout && title ? <Caption title={title} /> : null}
      {selectorItemModels
        ? <Selector verticalLayout={verticalLayout}
                  items={this.getSelectorItemModels()}
                  activeItemCode={router.payload.language}
                  closeDropDownCallback={closeDropDownCallback} />
        : null}
      </React.Fragment>
  }
}

const mapStateToProps = state => ({
  router: state.location,
  languages: state.languages,
  categories: state.categories,
  cities: state.cities
})

export default connect(mapStateToProps)(LanguageSelector)
