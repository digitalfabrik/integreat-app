import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined'
import { drawerClasses } from '@mui/material/Drawer'
import Popover from '@mui/material/Popover'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import useDimensions from '../hooks/useDimensions'
import HeaderActionItem from './HeaderActionItem'
import LanguageNotAvailableMessage from './LanguageNotAvailableMessage'
import LanguageSelection, { LanguageChangePath } from './LanguageSelection'
import Sidebar from './Sidebar'
import { SimpleAlertDialog } from './base/AlertDialog'

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
  feedbackAvailable?: boolean
}

const HeaderLanguageSelectorItem = ({
  languageChangePaths,
  languageCode,
  forceText = false,
  feedbackAvailable = false,
}: HeaderLanguageSelectorItemProps): ReactElement => {
  const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(null)
  const [alertDialogTitle, setAlertDialogTitle] = useState<string | null>(null)
  const { mobile, desktop } = useDimensions()
  const { t } = useTranslation('layout')

  const open = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorElement(event.currentTarget)
  const close = () => setAnchorElement(null)
  const isOpen = anchorElement !== null

  const openAlertDialog = (title: string) => {
    setAlertDialogTitle(title)
    close()
  }

  const currentLanguageName = languageChangePaths.find(item => item.code === languageCode)?.name

  const LanguageSelectionButton = (
    <HeaderActionItem
      key='languages'
      onClick={open}
      text={isOpen ? '' : t('changeLanguage') /* to not cover the dropdown with the tooltip */}
      icon={<TranslateOutlinedIcon />}
      innerText={forceText || desktop ? currentLanguageName : undefined}
    />
  )

  const closeAlertDialog = () => setAlertDialogTitle(null)
  const languageNotAvailableDialog = alertDialogTitle ? (
    <SimpleAlertDialog
      title={alertDialogTitle}
      body={<LanguageNotAvailableMessage feedbackAvailable={feedbackAvailable} close={closeAlertDialog} />}
      close={closeAlertDialog}
    />
  ) : null

  if (mobile) {
    return (
      <>
        <StyledSidebar openButton={LanguageSelectionButton} setOpen={() => setAnchorElement(null)} open={isOpen}>
          <LanguageSelection
            languageChangePaths={languageChangePaths}
            languageCode={languageCode}
            close={close}
            openAlertDialog={openAlertDialog}
          />
        </StyledSidebar>
        {languageNotAvailableDialog}
      </>
    )
  }

  return (
    <>
      {LanguageSelectionButton}
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
        <LanguageSelection
          languageChangePaths={languageChangePaths}
          languageCode={languageCode}
          close={close}
          openAlertDialog={openAlertDialog}
        />
      </Popover>
      {languageNotAvailableDialog}
    </>
  )
}

export default HeaderLanguageSelectorItem
