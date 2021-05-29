import React, { ReactElement } from 'react'
import SelectorItemModel from '../models/SelectorItemModel'
import Selector from '../components/Selector'
import { useTranslation } from 'react-i18next'
import HeaderLanguageSelectorItem from './HeaderLanguageSelectorItem'

type PropsType = {
  pathname: string
  languageCode: string
  isHeaderActionItem: boolean
  languageChangePaths: Array<{ code: string; path: string | null; name: string }> | null
}

/**
 * Displays a dropDown menu to handle changing of the language
 */
const LanguageSelector = (props: PropsType): ReactElement => {
  const { isHeaderActionItem, languageChangePaths, languageCode, pathname } = props
  const activeItemCode = languageCode
  const { t } = useTranslation('layout')

  const selectorItems = languageChangePaths?.map(languageChangePath => {
    const { code, name, path } = languageChangePath
    return new SelectorItemModel({
      code,
      name,
      href: code !== activeItemCode ? path : pathname
    })
  }) ?? []

  if (isHeaderActionItem) {
    return <HeaderLanguageSelectorItem selectorItems={selectorItems} activeItemCode={activeItemCode} t={t} />
  }

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

export default LanguageSelector
