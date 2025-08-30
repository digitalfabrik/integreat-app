import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import SelectorItemModel from '../models/SelectorItemModel'
import HeaderActionItem from './HeaderActionItem'
import Selector from './Selector'
import SidebarMenu from './SidebarMenu'

type MobileLanguageSelectorProps = {
  languageChangePaths: { code: string; path: string | null; name: string }[] | null
  languageCode: string
}

const MobileLanguageSelector = ({ languageChangePaths, languageCode }: MobileLanguageSelectorProps): ReactElement => {
  const { t } = useTranslation('layout')
  const [open, setOpen] = useState(false)

  const selectorItems =
    languageChangePaths?.map(
      ({ code, name, path }) =>
        new SelectorItemModel({
          code,
          name,
          href: path,
        }),
    ) ?? []

  const ChangeLanguageButton = (
    <HeaderActionItem
      key='languageChange'
      onClick={() => setOpen(true)}
      text={t('changeLanguage')}
      icon={<TranslateOutlinedIcon />}
    />
  )

  return (
    <SidebarMenu OpenButton={ChangeLanguageButton} setShow={setOpen} show={open}>
      <Selector
        close={() => setOpen(false)}
        verticalLayout={false}
        items={selectorItems}
        activeItemCode={languageCode}
        disabledItemTooltip={t('noTranslation')}
      />
    </SidebarMenu>
  )
}

export default MobileLanguageSelector
