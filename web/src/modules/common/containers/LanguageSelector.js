// @flow

import React from 'react'
import SelectorItemModel from '../models/SelectorItemModel'
import Selector from '../components/Selector'
import HeaderLanguageSelectorItem from '../../layout/components/HeaderLanguageSelectorItem'
import type { LocationState } from 'redux-first-router'
import { withTranslation, type TFunction } from 'react-i18next'
import type { LanguageChangePathsType } from '../../app/containers/Switcher'
import type { ThemeType } from 'build-configs/ThemeType'
import { withTheme } from 'styled-components'

type PropsType = {|
  location: LocationState,
  theme: ThemeType,
  isHeaderActionItem: boolean,
  languageChangePaths: ?LanguageChangePathsType,
  t: TFunction
|}

/**
 * Displays a dropDown menu to handle changing of the language
 */
export class LanguageSelector extends React.PureComponent<PropsType> {
  getSelectorItemModels (): Array<SelectorItemModel> {
    const { languageChangePaths, location } = this.props
    const activeItemCode = location.payload.language

    if (!languageChangePaths) {
      return []
    }

    return (
      languageChangePaths.map(languageChangePath => {
        const { code, name, path } = languageChangePath
        return new SelectorItemModel({
          code,
          name,
          href: code !== activeItemCode ? path : location.pathname
        })
      })
    )
  }

  render () {
    const { location, isHeaderActionItem, t, theme } = this.props
    const selectorItems = this.getSelectorItemModels()
    const activeItemCode = location.payload.language

    if (isHeaderActionItem) {
      return <HeaderLanguageSelectorItem
        theme={theme}
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

export default withTheme(withTranslation<PropsType>('layout')(LanguageSelector))
