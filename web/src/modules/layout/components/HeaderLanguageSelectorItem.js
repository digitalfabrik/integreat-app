// @flow

import React from 'react'
import SelectorItemModel from '../../common/models/SelectorItemModel'
import HeaderActionItemDropDown from './HeaderActionItemDropDown'
import Selector from '../../common/components/Selector'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import languageIcon from '../assets/language-icon.svg'
import HeaderActionBarItemLink from './HeaderActionItemLink'
import type { ThemeType } from 'build-configs/ThemeType'

type PropsType = {|
  selectorItems: Array<SelectorItemModel>,
  activeItemCode: string,
  theme: ThemeType,
  t: TFunction
|}

const HeaderLanguageSelectorItem = ({ selectorItems, activeItemCode, t, theme }: PropsType) => {
  const noLanguagesHint = t('noLanguages')

  return selectorItems && selectorItems.length > 0
    ? <HeaderActionItemDropDown theme={theme} iconSrc={languageIcon} text={t('changeLanguage')}>
      {closeDropDown => <Selector
        closeDropDown={closeDropDown}
        verticalLayout={false}
        items={selectorItems}
        activeItemCode={activeItemCode}
        disabledItemTooltip={t('noTranslation')} />}
    </HeaderActionItemDropDown>
    : <HeaderActionBarItemLink text={noLanguagesHint} iconSrc={languageIcon} />
}

export default withTranslation('layout')(HeaderLanguageSelectorItem)
