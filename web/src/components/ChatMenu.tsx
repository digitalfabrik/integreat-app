import MoreVertIcon from '@mui/icons-material/MoreVert'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import Typography from '@mui/material/Typography'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Dialog from './base/Dialog'

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
        <Dialog
          title={t('newChat')}
          close={onConfirmClose}
          actions={
            <DialogActions>
              <Button onClick={() => handleDialogAction(onConfirmClose)}>{t('layout:cancel')}</Button>
              <Button onClick={() => handleDialogAction(onConfirmNewChat)} variant='contained'>
                {t('newChat')}
              </Button>
            </DialogActions>
          }>
          <Typography variant='body1'>{t('newChatConfirmation')}</Typography>
        </Dialog>
      )}
    </>
  )
}

export default ChatMenu
