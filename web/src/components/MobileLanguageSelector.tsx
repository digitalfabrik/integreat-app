import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import SelectorItemModel from '../models/SelectorItemModel'
import CityContentFooter from './CityContentFooter'
import HeaderActionItem from './HeaderActionItem'
import HeaderLanguageSelectorItem from './HeaderLanguageSelectorItem'
import SidebarMenu from './SidebarMenu'

type MobileLanguageSelectorProps = {
  languageChangePaths: { code: string; path: string | null; name: string }[] | null
  languageCode: string
  cityCode: string
}

const MobileLanguageSelector = ({
  languageChangePaths,
  languageCode,
  cityCode,
}: MobileLanguageSelectorProps): ReactElement => {
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
      <SidebarMenu
        showButton={false}
        setShow={setIsLanguageSidebarOpen}
        show={isLanguageSidebarOpen}
        items={languageSidebarItems}
        Footer={<CityContentFooter city={cityCode} language={languageCode} mode='sidebar' />}
      />
    </>
  )
}

export default MobileLanguageSelector
