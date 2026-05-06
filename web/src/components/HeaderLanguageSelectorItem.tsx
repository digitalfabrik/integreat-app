import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import { drawerClasses } from '@mui/material/Drawer'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import useDimensions from '../hooks/useDimensions'
import HeaderActionItem from './HeaderActionItem'
import LanguageList, { LanguageChangePath } from './LanguageList'
import Sidebar from './Sidebar'
import AlertDialog from './base/AlertDialog'

const StyledSidebar = styled(Sidebar)({
  [`&.${drawerClasses.root}`]: {
    // Position sidebar above chat modal
    zIndex: 1500,
  },
})

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
  const [isLanguageNotAvailableDialogOpen, setIsLanguageNotAvailableDialogOpen] = useState(false)
  const { mobile, desktop } = useDimensions()
  const { t } = useTranslation('layout')

  const open = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorElement(event.currentTarget)
  const close = () => setAnchorElement(null)
  const openUnavailableLanguageDialog = () => {
    setIsLanguageNotAvailableDialogOpen(true)
    close()
  }
  const closeUnavailableLanguageDialog = () => setIsLanguageNotAvailableDialogOpen(false)
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

  const languageNotAvailableDialog = isLanguageNotAvailableDialogOpen ? (
    <AlertDialog
      title={t('noTranslation')}
      close={closeUnavailableLanguageDialog}
      actions={
        <DialogActions>
          <Button onClick={closeUnavailableLanguageDialog} variant='outlined'>
            {t('common:close')}
          </Button>
        </DialogActions>
      }>
      <Typography variant='body2'>{t('languageNotAvailableMessage')}</Typography>
    </AlertDialog>
  ) : null

  if (mobile) {
    return (
      <>
        <StyledSidebar OpenButton={ChangeLanguageButton} setOpen={() => setAnchorElement(null)} open={isOpen}>
          <LanguageList
            languageChangePaths={languageChangePaths}
            languageCode={languageCode}
            close={close}
            onUnavailableLanguageClick={openUnavailableLanguageDialog}
          />
        </StyledSidebar>
        {languageNotAvailableDialog}
      </>
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
        <LanguageList
          languageChangePaths={languageChangePaths}
          languageCode={languageCode}
          close={close}
          onUnavailableLanguageClick={openUnavailableLanguageDialog}
        />
      </Popover>
      {languageNotAvailableDialog}
    </>
  )
}

export default HeaderLanguageSelectorItem
