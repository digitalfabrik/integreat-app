import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import SelectorItemModel from '../models/SelectorItemModel'
import HeaderActionItemDropDown from './HeaderActionItemDropDown'
import HeaderActionBarItemLink from './HeaderActionItemLink'
import KebabActionItemDropDown from './KebabActionItemDropDown'
import Selector from './Selector'

type HeaderLanguageSelectorItemProps = {
  selectorItems: SelectorItemModel[]
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
        <KebabActionItemDropDown iconSrc={LanguageOutlinedIcon} text={t('changeLanguage')} closeSidebar={closeSidebar}>
          {renderItem}
        </KebabActionItemDropDown>
      )
    }

    return (
      <HeaderActionItemDropDown
        iconSrc={LanguageOutlinedIcon}
        text={t('changeLanguage')}
        innerText={selectorItems.find(item => item.code === activeItemCode)?.name}>
        {renderItem}
      </HeaderActionItemDropDown>
    )
  }

  if (selectorItems.length > 0) {
    return renderActionItem()
  }

  return <HeaderActionBarItemLink text={noLanguagesHint} iconSrc={LanguageOutlinedIcon} />
}

export default HeaderLanguageSelectorItem
