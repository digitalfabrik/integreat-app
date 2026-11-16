import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import MenuItem from './MenuItem'
import AlertDialog from './base/AlertDialog'
import Menu from './base/Menu'

type ChatMenuProps = {
  chatId: string | null
  resetChat: () => void
}

const ChatMenu = ({ chatId, resetChat }: ChatMenuProps): ReactElement => {
  const [newChatConfirmationDialogOpen, setNewChatConfirmationDialogOpen] = useState(false)
  const { t } = useTranslation()

  const cancelNewChat = () => {
    setNewChatConfirmationDialogOpen(false)
  }
  const createNewChat = () => {
    resetChat()
    setNewChatConfirmationDialogOpen(false)
  }

  return (
    <>
      <Menu disablePortal>
        {closeMenu => (
          <MenuItem
            text={t($ => $.chat.startNew.title)}
            icon={<AddCommentOutlinedIcon fontSize='small' />}
            disabled={chatId === null}
            onClick={() => setNewChatConfirmationDialogOpen(true)}
            closeMenu={closeMenu}
          />
        )}
      </Menu>

      {newChatConfirmationDialogOpen && (
        <AlertDialog
          title={t($ => $.chat.startNew.title)}
          close={() => setNewChatConfirmationDialogOpen(false)}
          actions={
            <DialogActions>
              <Button onClick={cancelNewChat} variant='outlined' sx={{ flex: '1 1' }}>
                {t($ => $.common.actions.cancel)}
              </Button>
              <Button onClick={createNewChat} variant='contained' sx={{ flex: '3 3' }}>
                {t($ => $.chat.startNew.title)}
              </Button>
            </DialogActions>
          }>
          <Typography variant='body2'>{t($ => $.chat.startNew.description)}</Typography>
        </AlertDialog>
      )}
    </>
  )
}

export default ChatMenu
