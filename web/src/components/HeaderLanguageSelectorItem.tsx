import React, { ReactElement } from 'react'
import { TFunction } from 'react-i18next'

import { UiDirectionType } from 'translations/src'

import languageIcon from '../assets/language-icon.svg'
import SelectorItemModel from '../models/SelectorItemModel'
import HeaderActionItemDropDown from './HeaderActionItemDropDown'
import HeaderActionBarItemLink from './HeaderActionItemLink'
import KebabActionItemDropDown from './KebabActionItemDropDown'
import Selector from './Selector'

type HeaderLanguageSelectorItemProps = {
  selectorItems: Array<SelectorItemModel>
  activeItemCode: string
  t: TFunction<'layout'>
  inKebabMenu?: boolean
  direction?: UiDirectionType
  closeSidebar?: () => void
}

const HeaderLanguageSelectorItem = ({
  selectorItems,
  activeItemCode,
  t,
  inKebabMenu = false,
  direction,
  closeSidebar,
}: HeaderLanguageSelectorItemProps): ReactElement => {
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
        <KebabActionItemDropDown
          iconSrc={languageIcon}
          text={t('changeLanguage')}
          direction={direction}
          closeSidebar={closeSidebar}>
          {renderItem}
        </KebabActionItemDropDown>
      )
    }

    return (
      <HeaderActionItemDropDown iconSrc={languageIcon} text={t('changeLanguage')} direction={direction}>
        {renderItem}
      </HeaderActionItemDropDown>
    )
  }

  if (selectorItems.length > 0) {
    return renderActionItem()
  }

  return <HeaderActionBarItemLink text={noLanguagesHint} iconSrc={languageIcon} direction={direction} />
}

export default HeaderLanguageSelectorItem
