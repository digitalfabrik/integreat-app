import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import MenuItem from './MenuItem'
import AlertDialog from './base/AlertDialog'

type ChatMenuProps = {
  chatId: string | null
  updateChatId: (newValue: string | null) => void
}

const ChatMenu = ({ chatId, updateChatId }: ChatMenuProps): ReactElement => {
  const [menuAnchorElement, setMenuAnchorElement] = useState<HTMLElement | null>(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const { t } = useTranslation('chat')

  const handleDialogAction = (action: () => void) => {
    setMenuAnchorElement(null)
    action()
  }

  const resetChatId = () => {
    updateChatId(null)
    setConfirmDialogOpen(false)
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
        open={menuAnchorElement !== null && !confirmDialogOpen}
        onClose={() => setMenuAnchorElement(null)}>
        <MenuItem
          text={t('newChat')}
          icon={<AddCommentOutlinedIcon fontSize='small' />}
          disabled={chatId === null}
          onClick={() => setConfirmDialogOpen(true)}
        />
      </MuiMenu>
      {confirmDialogOpen && (
        <AlertDialog
          title={t('newChat')}
          close={() => setConfirmDialogOpen(false)}
          actions={
            <DialogActions>
              <Button
                onClick={() => handleDialogAction(() => setConfirmDialogOpen(false))}
                variant='outlined'
                sx={{ flex: '1 1' }}>
                {t('layout:cancel')}
              </Button>
              <Button onClick={() => handleDialogAction(resetChatId)} variant='contained' sx={{ flex: '3 3' }}>
                {t('newChat')}
              </Button>
            </DialogActions>
          }>
          <Stack>
            <Typography variant='body2'>{t('newChatConfirmation')}</Typography>
            <Typography variant='body2'>{t('newChatConfirmationMessage')}</Typography>
          </Stack>
        </AlertDialog>
      )}
    </>
  )
}

export default ChatMenu
