import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { LanguageIcon } from '../assets'
import SelectorItemModel from '../models/SelectorItemModel'
import HeaderActionItemDropDown from './HeaderActionItemDropDown'
import HeaderActionBarItemLink from './HeaderActionItemLink'
import KebabActionItemDropDown from './KebabActionItemDropDown'
import Selector from './Selector'

type HeaderLanguageSelectorItemProps = {
  selectorItems: Array<SelectorItemModel>
  activeItemCode: string
  inKebabMenu?: boolean
  closeSidebar?: () => void
}

const HeaderLanguageSelectorItem = ({
  selectorItems,
  activeItemCode,
  inKebabMenu = false,
  closeSidebar,
}: HeaderLanguageSelectorItemProps): ReactElement => {
  const { t } = useTranslation('layout')
  const noLanguagesHint = t('noLanguages')

  const renderItem = (closeDropDown: () => void): ReactElement => (
    <Selector
      closeDropDown={closeDropDown}
      verticalLayout={false}
      items={selectorItems}
      activeItemCode={activeItemCode}
      disabledItemTooltip={t('noTranslation')}
    />
  )

  const renderActionItem = () => {
    if (inKebabMenu && closeSidebar) {
      return (
        <KebabActionItemDropDown iconSrc={LanguageIcon} text={t('changeLanguage')} closeSidebar={closeSidebar}>
          {renderItem}
        </KebabActionItemDropDown>
      )
    }

    return (
      <HeaderActionItemDropDown iconSrc={LanguageIcon} text={t('changeLanguage')}>
        {renderItem}
      </HeaderActionItemDropDown>
    )
  }

  if (selectorItems.length > 0) {
    return renderActionItem()
  }

  return <HeaderActionBarItemLink text={noLanguagesHint} iconSrc={LanguageIcon} />
}

export default HeaderLanguageSelectorItem
