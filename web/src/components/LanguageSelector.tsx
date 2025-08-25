import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import Selector from '../components/Selector'
import SelectorItemModel from '../models/SelectorItemModel'
import HeaderLanguageSelectorItem from './HeaderLanguageSelectorItem'

type LanguageSelectorProps = {
  languageCode: string
  isHeaderActionItem: boolean
  languageChangePaths: { code: string; path: string | null; name: string }[] | null
  inSidebarMenu?: boolean
  closeSidebar?: () => void
}

/**
 * Displays a dropDown menu to handle changing of the language
 */
const LanguageSelector = (props: LanguageSelectorProps): ReactElement => {
  const { isHeaderActionItem, languageChangePaths, languageCode, inSidebarMenu = false, closeSidebar } = props
  const activeItemCode = languageCode
  const { t } = useTranslation('layout')

  const selectorItems =
    languageChangePaths?.map(
      ({ code, name, path }) =>
        new SelectorItemModel({
          code,
          name,
          href: path,
        }),
    ) ?? []

  if (isHeaderActionItem) {
    return (
      <HeaderLanguageSelectorItem
        selectorItems={selectorItems}
        activeItemCode={activeItemCode}
        inSidebarMenu={inSidebarMenu}
        closeSidebar={closeSidebar}
      />
    )
  }

  const availableItems = selectorItems.filter(item => item.href !== null)

  return (
    <Selector
      verticalLayout
      items={availableItems}
      activeItemCode={activeItemCode}
      disabledItemTooltip={t('noTranslation')}
    />
  )
}

export default LanguageSelector
