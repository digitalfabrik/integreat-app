// @flow

import React from 'react'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import { PoiModel, LanguageModel, CategoriesMapModel, EventModel } from '@integreat-app/integreat-api-client'
import SelectorItemModel from '../models/SelectorItemModel'
import Selector from '../components/Selector'
import HeaderLanguageSelectorItem from '../../layout/components/HeaderLanguageSelectorItem'

import type { Location } from 'redux-first-router'
import type { StateType } from '../../app/StateType'
import type { TFunction } from 'react-i18next'
import { withNamespaces } from 'react-i18next'
import map from 'lodash/map'
import type { LanguageChangePathsType } from '../../app/containers/Switcher'

type PropsType = {|
  languages: Array<LanguageModel>,
  location: Location,
  categories: CategoriesMapModel,
  events: Array<EventModel>,
  pois: Array<PoiModel>,
  isHeaderActionItem: boolean,
  languageChangePaths: ?LanguageChangePathsType,
  t: TFunction
|}

/**
 * Displays a dropDown menu to handle changing of the language
 */
export class LanguageSelector extends React.PureComponent<PropsType> {
  getSelectorItemModels (): Array<SelectorItemModel> {
    const {languageChangePaths, location} = this.props
    const activeItemCode = location.payload.language

    if (!languageChangePaths) {
      return []
    }

    return (
      map(languageChangePaths, (value, key) => new SelectorItemModel({
        code: key,
        name: value.name,
        href: key !== activeItemCode ? value.path : location.pathname
      }))
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
