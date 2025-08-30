import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import SelectorItemModel from '../models/SelectorItemModel'
import HeaderActionItemDropDown from './HeaderActionItemDropDown'
import Selector from './Selector'

type HeaderLanguageSelectorItemProps = {
  selectorItems: SelectorItemModel[]
  activeItemCode: string
}

const HeaderLanguageSelectorItem = ({
  selectorItems,
  activeItemCode,
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
