import React, { ReactElement } from 'react'
import { TFunction } from 'react-i18next'

import languageIcon from '../assets/language-icon.svg'
import SelectorItemModel from '../models/SelectorItemModel'
import HeaderActionItemDropDown from './HeaderActionItemDropDown'
import HeaderActionBarItemLink from './HeaderActionItemLink'
import Selector from './Selector'

type PropsType = {
  selectorItems: Array<SelectorItemModel>
  activeItemCode: string
  t: TFunction<'layout'>
}

const HeaderLanguageSelectorItem = ({ selectorItems, activeItemCode, t }: PropsType): ReactElement => {
  const noLanguagesHint = t('noLanguages')

  return selectorItems.length > 0 ? (
    <HeaderActionItemDropDown iconSrc={languageIcon} text={t('changeLanguage')}>
      {closeDropDown => (
        <Selector
          closeDropDown={closeDropDown}
          verticalLayout={false}
          items={selectorItems}
          activeItemCode={activeItemCode}
          disabledItemTooltip={t('noTranslation')}
        />
      )}
    </HeaderActionItemDropDown>
  ) : (
    <HeaderActionBarItemLink text={noLanguagesHint} iconSrc={languageIcon} />
  )
}

export default HeaderLanguageSelectorItem
