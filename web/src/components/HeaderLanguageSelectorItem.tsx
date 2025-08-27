import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import SelectorItemModel from '../models/SelectorItemModel'
import HeaderActionItemDropDown from './HeaderActionItemDropDown'
import Selector from './Selector'
import SidebarActionItemDropDown from './SidebarActionItemDropDown'

type HeaderLanguageSelectorItemProps = {
  selectorItems: SelectorItemModel[]
  activeItemCode: string
  inSidebarMenu?: boolean
  closeSidebar?: () => void
  isOpen?: boolean
}

const HeaderLanguageSelectorItem = ({
  selectorItems,
  activeItemCode,
  inSidebarMenu = false,
  closeSidebar,
  isOpen = false,
}: HeaderLanguageSelectorItemProps): ReactElement => {
  const { t } = useTranslation('layout')

  const renderItem = (closeDropDown: () => void): ReactElement => (
    <Selector
      closeDropDown={closeDropDown}
      verticalLayout={false}
      items={selectorItems}
      activeItemCode={activeItemCode}
      disabledItemTooltip={t('noTranslation')}
    />
  )

  if (inSidebarMenu && closeSidebar) {
    return (
      <SidebarActionItemDropDown
        iconSrc={TranslateOutlinedIcon}
        text={t('changeLanguage')}
        closeSidebar={closeSidebar}
        isOpen={isOpen}>
        {renderItem}
      </SidebarActionItemDropDown>
    )
  }
  return (
    <HeaderActionItemDropDown
      icon={<TranslateOutlinedIcon />}
      text={t('changeLanguage')}
      innerText={selectorItems.find(item => item.code === activeItemCode)?.name}>
      {renderItem}
    </HeaderActionItemDropDown>
  )
}

export default HeaderLanguageSelectorItem
