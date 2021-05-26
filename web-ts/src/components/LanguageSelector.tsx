import React from 'react'
import SelectorItemModel from '../models/SelectorItemModel'
import Selector from '../components/Selector'
import { withTranslation, TFunction } from 'react-i18next'

type PropsType = {
  pathname: string
  languageCode: string
  isHeaderActionItem: boolean
  languageChangePaths: Array<{ code: string; path: string | null; name: string }> | null
  t: TFunction
}

/**
 * Displays a dropDown menu to handle changing of the language
 */
export class LanguageSelector extends React.PureComponent<PropsType> {
  getSelectorItemModels(): Array<SelectorItemModel> {
    const { languageChangePaths, languageCode, pathname } = this.props
    const activeItemCode = languageCode

    if (!languageChangePaths) {
      return []
    }

    return languageChangePaths.map(languageChangePath => {
      const { code, name, path } = languageChangePath
      return new SelectorItemModel({
        code,
        name,
        href: code !== activeItemCode ? path : pathname
      })
    })
  }

  render() {
    const { isHeaderActionItem, languageCode, t } = this.props
    const selectorItems = this.getSelectorItemModels()
    const activeItemCode = languageCode

    // TODO IGAPP-645: Uncomment
    // if (isHeaderActionItem) {
    //   return <HeaderLanguageSelectorItem selectorItems={selectorItems} activeItemCode={activeItemCode} />
    // }

    return (
      selectorItems && (
        <Selector
          verticalLayout
          items={selectorItems}
          activeItemCode={activeItemCode}
          disabledItemTooltip={t('noTranslation')}
        />
      )
    )
  }
}

export default withTranslation('layout')(LanguageSelector)
