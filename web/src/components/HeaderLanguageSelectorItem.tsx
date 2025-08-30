import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import useWindowDimensions from '../hooks/useWindowDimensions'
import HeaderActionItem from './HeaderActionItem'
import HeaderActionItemDropDown from './HeaderActionItemDropDown'
import LanguageSelector from './LanguageSelector'
import SidebarMenu from './SidebarMenu'

type HeaderLanguageSelectorItemProps = {
  languageChangePaths: { code: string; path: string | null; name: string }[] | null
  languageCode: string
}

const HeaderLanguageSelectorItem = ({
  languageChangePaths,
  languageCode,
}: HeaderLanguageSelectorItemProps): ReactElement => {
  const [open, setOpen] = useState(false)
  const { viewportSmall } = useWindowDimensions()
  const { t } = useTranslation('layout')

  if (viewportSmall) {
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
        <LanguageSelector
          languageChangePaths={languageChangePaths}
          languageCode={languageCode}
          close={() => setOpen(false)}
          vertical
        />
      </SidebarMenu>
    )
  }

  return (
    <HeaderActionItemDropDown
      icon={<TranslateOutlinedIcon />}
      text={t('changeLanguage')}
      innerText={languageChangePaths?.find(item => item.code === languageCode)?.name}>
      {close => (
        <LanguageSelector
          languageChangePaths={languageChangePaths}
          languageCode={languageCode}
          vertical={false}
          close={close}
        />
      )}
    </HeaderActionItemDropDown>
  )
}

export default HeaderLanguageSelectorItem
