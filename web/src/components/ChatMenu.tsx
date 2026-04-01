import MoreVertIcon from '@mui/icons-material/MoreVert'
import Button from '@mui/material/Button'
import { dialogClasses } from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Dialog from './base/Dialog'

const StyledDialog = styled(Dialog)(({ theme }) => ({
  [`.${dialogClasses.paper}`]: {
    margin: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
      width: 570,
    },
  },
}))

const StyledDialogContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
})

type ChatMenuProps = {
  confirmNewChatOpen: boolean
  onConfirmClose: () => void
  onConfirmNewChat: () => void
  children: ReactElement | ReactElement[]
}

const ChatMenu = ({ confirmNewChatOpen, onConfirmClose, onConfirmNewChat, children }: ChatMenuProps): ReactElement => {
  const [menuAnchorElement, setMenuAnchorElement] = useState<HTMLElement | null>(null)
  const { t } = useTranslation('chat')

  const handleDialogAction = (action: () => void) => {
    setMenuAnchorElement(null)
    action()
  }

  return (
    <>
      <IconButton
        aria-label={t('chatOptions')}
        onClick={event => setMenuAnchorElement(event.currentTarget)}
        aria-expanded={menuAnchorElement !== null}>
        <MoreVertIcon />
      </IconButton>
      <MuiMenu
        anchorEl={menuAnchorElement}
        open={menuAnchorElement !== null && !confirmNewChatOpen}
        onClose={() => setMenuAnchorElement(null)}>
        {children}
      </MuiMenu>
      {confirmNewChatOpen && (
        <StyledDialog
          fullScreen={false}
          title={t('newChat')}
          close={onConfirmClose}
          footerActions={
            <DialogActions>
              <Button onClick={() => handleDialogAction(onConfirmClose)} variant='outlined' sx={{ flex: '1 1' }}>
                {t('layout:cancel')}
              </Button>
              <Button onClick={() => handleDialogAction(onConfirmNewChat)} variant='contained' sx={{ flex: '3 3' }}>
                {t('newChat')}
              </Button>
            </DialogActions>
          }>
          <StyledDialogContainer>
            <Typography variant='body2'>{t('newChatConfirmationTitle')}</Typography>
            <Typography variant='body2'>{t('newChatConfirmationMessage')}</Typography>
          </StyledDialogContainer>
        </StyledDialog>
      )}
    </>
  )
}

export default ChatMenu
