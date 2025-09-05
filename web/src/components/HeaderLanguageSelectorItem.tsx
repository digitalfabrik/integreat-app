import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import useWindowDimensions from '../hooks/useWindowDimensions'
import Dropdown from './Dropdown'
import HeaderActionItem from './HeaderActionItem'
import LanguageSelector from './LanguageSelector'
import Sidebar from './Sidebar'

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

  const currentLanguageName = languageChangePaths?.find(item => item.code === languageCode)?.name

  const ChangeLanguageButton = (
    <HeaderActionItem
      key='languageChange'
      onClick={() => setOpen(open => !open)}
      text={t('changeLanguage')}
      icon={<TranslateOutlinedIcon />}
      innerText={viewportSmall ? undefined : currentLanguageName}
    />
  )

  if (viewportSmall) {
    return (
      <Sidebar OpenButton={ChangeLanguageButton} setShow={setOpen} show={open}>
        <LanguageSelector
          languageChangePaths={languageChangePaths}
          languageCode={languageCode}
          close={() => setOpen(false)}
          vertical
        />
      </Sidebar>
    )
  }

  return (
    <Dropdown ToggleButton={ChangeLanguageButton} setOpen={setOpen} open={open}>
      <LanguageSelector
        languageChangePaths={languageChangePaths}
        languageCode={languageCode}
        vertical={false}
        close={() => setOpen(false)}
      />
    </Dropdown>
  )
}

export default HeaderLanguageSelectorItem
