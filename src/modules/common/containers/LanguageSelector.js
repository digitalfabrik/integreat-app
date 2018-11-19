// @flow

import React from 'react'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import LanguageModel from '../../../modules/endpoint/models/LanguageModel'
import SelectorItemModel from '../models/SelectorItemModel'
import Selector from '../components/Selector'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'
import EventModel from '../../endpoint/models/EventModel'
import HeaderLanguageSelectorItem from '../../layout/components/HeaderLanguageSelectorItem'

import type { Location } from 'redux-first-router'
import type { StateType } from '../../app/StateType'
import type { TFunction } from 'react-i18next'
import { withNamespaces } from 'react-i18next'

import getLanguageChangePath from '../../app/getLanguageChangePath'
import PoiModel from '../../endpoint/models/PoiModel'

type PropsType = {|
  languages: Array<LanguageModel>,
  location: Location,
  categories: CategoriesMapModel,
  events: Array<EventModel>,
  pois: Array<PoiModel>,
  isHeaderActionItem: boolean,
  t: TFunction
|}

/**
 * Displays a dropDown menu to handle changing of the language
 */
export class LanguageSelector extends React.PureComponent<PropsType> {
  getSelectorItemModels (): Array<SelectorItemModel> {
    const {categories, events, pois, location, languages} = this.props
    const activeItemCode = location.payload.language
    const pathname = location.pathname

    return (
      languages &&
      languages.map(language => {
        const changePath = getLanguageChangePath({
          categories,
          events,
          location,
          pois,
          languageCode: language.code
        })

        return new SelectorItemModel({
          code: language.code,
          name: language.name,
          href: language.code !== activeItemCode ? changePath : pathname
        })
      })
    )
  }

  render () {
    const {location, isHeaderActionItem, t} = this.props
    const selectorItems = this.getSelectorItemModels()
    const activeItemCode = location.payload.language

    if (isHeaderActionItem) {
      return <HeaderLanguageSelectorItem
        selectorItems={selectorItems}
        activeItemCode={activeItemCode} />
    }

    return selectorItems &&
      <Selector
        verticalLayout
        items={selectorItems}
        activeItemCode={activeItemCode}
        disabledItemTooltip={t('noTranslation')} />
  }
}

const mapStateToProps = (state: StateType) => ({
  location: state.location,
  languages: state.languages.data,
  categories: state.categories.data,
  events: state.events.data,
  pois: state.pois.data
})

export default compose(connect(mapStateToProps), withNamespaces('layout'))(
  LanguageSelector
)
