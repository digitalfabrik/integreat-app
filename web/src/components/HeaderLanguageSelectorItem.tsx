import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined'
import Popover from '@mui/material/Popover'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import useDimensions from '../hooks/useDimensions'
import HeaderActionItem from './HeaderActionItem'
import LanguageList, { LanguageChangePath } from './LanguageList'
import Sidebar from './Sidebar'

type HeaderLanguageSelectorItemProps = {
  languageChangePaths: LanguageChangePath[]
  languageCode: string
  forceText?: boolean
}

const HeaderLanguageSelectorItem = ({
  languageChangePaths,
  languageCode,
  forceText = false,
}: HeaderLanguageSelectorItemProps): ReactElement => {
  const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(null)
  const { mobile, desktop } = useDimensions()
  const { t } = useTranslation('layout')

  const open = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorElement(event.currentTarget)
  const close = () => setAnchorElement(null)
  const isOpen = anchorElement !== null

  const currentLanguageName = languageChangePaths.find(item => item.code === languageCode)?.name

  const ChangeLanguageButton = (
    <HeaderActionItem
      key='languageChange'
      onClick={open}
      text={isOpen ? '' : t('changeLanguage') /* to not cover the dropdown with the tooltip */}
      icon={<TranslateOutlinedIcon />}
      innerText={forceText || desktop ? currentLanguageName : undefined}
    />
  )

  if (mobile) {
    return (
      <Sidebar OpenButton={ChangeLanguageButton} setOpen={() => setAnchorElement(null)} open={isOpen}>
        <LanguageList languageChangePaths={languageChangePaths} languageCode={languageCode} close={close} />
      </Sidebar>
    )
  }

  return (
    <>
      {ChangeLanguageButton}
      <Popover
        open={isOpen}
        onClose={close}
        anchorEl={anchorElement}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: -16,
          horizontal: 'center',
        }}
        slotProps={{
          paper: {
            sx: { boxShadow: 'none', overflow: 'visible' },
          },
        }}>
        <LanguageList languageChangePaths={languageChangePaths} languageCode={languageCode} close={close} />
      </Popover>
    </>
  )
}

export default HeaderLanguageSelectorItem
