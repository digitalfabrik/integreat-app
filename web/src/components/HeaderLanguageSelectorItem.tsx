import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import HeaderActionItemDropDown from './HeaderActionItemDropDown'
import LanguageSelector from './LanguageSelector'

type HeaderLanguageSelectorItemProps = {
  languageChangePaths: { code: string; path: string | null; name: string }[] | null
  languageCode: string
}

const HeaderLanguageSelectorItem = ({
  languageChangePaths,
  languageCode,
}: HeaderLanguageSelectorItemProps): ReactElement => {
  const { t } = useTranslation('layout')

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
