import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import SelectorItemModel from '../models/SelectorItemModel'
import HeaderActionItem from './HeaderActionItem'
import HeaderLanguageSelectorItem from './HeaderLanguageSelectorItem'
import SidebarMenu from './SidebarMenu'

type MobileLanguageSelectorProps = {
  languageChangePaths: { code: string; path: string | null; name: string }[] | null
  languageCode: string
}

const MobileLanguageSelector = ({ languageChangePaths, languageCode }: MobileLanguageSelectorProps): ReactElement => {
  const { t } = useTranslation('layout')
  const [isLanguageSidebarOpen, setIsLanguageSidebarOpen] = useState(false)

  const MobileLanguageButton = (
    <HeaderActionItem
      key='languageChange'
      onClick={() => {
        setIsLanguageSidebarOpen(true)
      }}
      text={t('changeLanguage')}
      icon={<TranslateOutlinedIcon />}
    />
  )

  const selectorItems =
    languageChangePaths?.map(
      ({ code, name, path }) =>
        new SelectorItemModel({
          code,
          name,
          href: path,
        }),
    ) ?? []

  const languageSidebarItems = [
    <HeaderLanguageSelectorItem
      key='language'
      selectorItems={selectorItems}
      activeItemCode={languageCode}
      inSidebarMenu
      closeSidebar={() => setIsLanguageSidebarOpen(false)}
      isOpen
    />,
  ]

  return (
    <>
      {MobileLanguageButton}
      <SidebarMenu showButton={false} setShow={setIsLanguageSidebarOpen} show={isLanguageSidebarOpen} Footer={null}>
        {languageSidebarItems}
      </SidebarMenu>
    </>
  )
}

export default MobileLanguageSelector
