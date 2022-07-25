import React, { ReactElement } from 'react'
import { TFunction } from 'react-i18next'

import languageIcon from '../assets/language-icon.svg'
import SelectorItemModel from '../models/SelectorItemModel'
import HeaderActionItemDropDown from './HeaderActionItemDropDown'
import HeaderActionBarItemLink from './HeaderActionItemLink'
import KebabActionItemDropDown from './KebabActionItemDropDown'
import Selector from './Selector'

type PropsType = {
  selectorItems: Array<SelectorItemModel>
  activeItemCode: string
  t: TFunction<'layout'>
  inKebabMenu?: boolean
}

const HeaderLanguageSelectorItem = ({
  selectorItems,
  activeItemCode,
  t,
  inKebabMenu = false
}: PropsType): ReactElement => {
  const noLanguagesHint = t('noLanguages')

  const Item = (closeDropDown: () => void): ReactElement => (
    <Selector
      closeDropDown={closeDropDown}
      verticalLayout={false}
      items={selectorItems}
      activeItemCode={activeItemCode}
      disabledItemTooltip={t('noTranslation')}
    />
  )

  const renderActionItem = () => {
    if (inKebabMenu) {
      return (
        <KebabActionItemDropDown iconSrc={languageIcon} text={t('changeLanguage')}>
          {Item}
        </KebabActionItemDropDown>
      )
    }

    return (
      <HeaderActionItemDropDown iconSrc={languageIcon} text={t('changeLanguage')}>
        {Item}
      </HeaderActionItemDropDown>
    )
  }

  return selectorItems.length > 0 ? (
    renderActionItem()
  ) : (
    <HeaderActionBarItemLink text={noLanguagesHint} iconSrc={languageIcon} />
  )
}

export default HeaderLanguageSelectorItem
