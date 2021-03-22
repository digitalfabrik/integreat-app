// @flow

import React from 'react'
import SelectorItemModel from '../../common/models/SelectorItemModel'
import HeaderActionItemDropDown from './HeaderActionItemDropDown'
import Selector from '../../common/components/Selector'
import { withTranslation, type TFunction } from 'react-i18next'
import languageIcon from '../assets/language-icon.svg'
import HeaderActionBarItemLink from './HeaderActionItemLink'
import type { UiDirectionType } from '../../i18n/types/UiDirectionType'

type PropsType = {|
  selectorItems: Array<SelectorItemModel>,
  activeItemCode: string,
  direction: UiDirectionType,
  t: TFunction
|}

const HeaderLanguageSelectorItem = ({ selectorItems, activeItemCode, direction, t }: PropsType) => {
  const noLanguagesHint = t('noLanguages')

  return selectorItems && selectorItems.length > 0 ? (
    <HeaderActionItemDropDown iconSrc={languageIcon} text={t('changeLanguage')} direction={direction}>
      {closeDropDown => (
        <Selector
          closeDropDown={closeDropDown}
          verticalLayout={false}
          items={selectorItems}
          activeItemCode={activeItemCode}
          disabledItemTooltip={t('noTranslation')}
          direction={direction}
        />
      )}
    </HeaderActionItemDropDown>
  ) : (
    <HeaderActionBarItemLink text={noLanguagesHint} iconSrc={languageIcon} direction={direction} />
  )
}

export default withTranslation<PropsType>('layout')(HeaderLanguageSelectorItem)
