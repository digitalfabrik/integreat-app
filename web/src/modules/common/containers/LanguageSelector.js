// @flow

import React from 'react'
import SelectorItemModel from '../models/SelectorItemModel'
import Selector from '../components/Selector'
import HeaderLanguageSelectorItem from '../../layout/components/HeaderLanguageSelectorItem'
import type { LocationState } from 'redux-first-router'
import { withTranslation, type TFunction } from 'react-i18next'
import type { LanguageChangePathsType } from '../../app/containers/Switcher'
import type { UiDirectionType } from '../../i18n/types/UiDirectionType'

type PropsType = {|
  location: LocationState,
  isHeaderActionItem: boolean,
  languageChangePaths: ?LanguageChangePathsType,
  direction: UiDirectionType,
  t: TFunction
|}

/**
 * Displays a dropDown menu to handle changing of the language
 */
export const LanguageSelector = ({ location, isHeaderActionItem, languageChangePaths, direction, t }: PropsType) => {
  const getSelectorItemModels = (): Array<SelectorItemModel> => {
    const activeItemCode = location.payload.language

    if (!languageChangePaths) {
      return []
    }

    return languageChangePaths.map(languageChangePath => {
      const { code, name, path } = languageChangePath
      return new SelectorItemModel({
        code,
        name,
        href: code !== activeItemCode ? path : location.pathname
      })
    })
  }

  const selectorItems = getSelectorItemModels()
  const activeItemCode = location.payload.language

  if (isHeaderActionItem) {
    return (
      <HeaderLanguageSelectorItem selectorItems={selectorItems} activeItemCode={activeItemCode} direction={direction} />
    )
  }

  return (
    selectorItems && (
      <Selector
        verticalLayout
        items={selectorItems}
        activeItemCode={activeItemCode}
        disabledItemTooltip={t('noTranslation')}
        direction={direction}
      />
    )
  )
}

export default withTranslation<PropsType>('layout')(LanguageSelector)
