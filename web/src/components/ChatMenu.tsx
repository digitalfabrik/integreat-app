import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import MenuItem from './MenuItem'
import QrCodeDialog from './QrCodeDialog'
import AlertDialog from './base/AlertDialog'

type ChatMenuProps = {
  chatId: string | null
  ticketUrl: string | null
  resetChat: () => void
}

const ChatMenu = ({ chatId, ticketUrl, resetChat }: ChatMenuProps): ReactElement => {
  const [menuAnchorElement, setMenuAnchorElement] = useState<HTMLElement | null>(null)
  const [newChatConfirmationDialogOpen, setNewChatConfirmationDialogOpen] = useState(false)
  const [qrCodeDialogOpen, setQrCodeDialogOpen] = useState(false)
  const { t } = useTranslation('chat')

  const cancelNewChat = () => {
    setMenuAnchorElement(null)
    setNewChatConfirmationDialogOpen(false)
  }
  const createNewChat = () => {
    setMenuAnchorElement(null)
    resetChat()
    setNewChatConfirmationDialogOpen(false)
  }
  const closeConsultationQrCodeDialog = () => {
    setMenuAnchorElement(null)
    setQrCodeDialogOpen(false)
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
        open={menuAnchorElement !== null && !newChatConfirmationDialogOpen && !qrCodeDialogOpen}
        onClose={() => setMenuAnchorElement(null)}>
        <MenuItem
          text={t('newChat')}
          icon={<AddCommentOutlinedIcon fontSize='small' />}
          disabled={chatId === null}
          onClick={() => setNewChatConfirmationDialogOpen(true)}
        />
        <MenuItem
          text={t('consultationQrCodeTitle')}
          icon={<QrCode2Icon fontSize='small' />}
          disabled={ticketUrl === null}
          onClick={() => setQrCodeDialogOpen(true)}
        />
      </MuiMenu>

      <QrCodeDialog
        open={qrCodeDialogOpen}
        close={closeConsultationQrCodeDialog}
        title={t('consultationQrCodeTitle')}
        description={t('consultationQrCodeDescription')}
        content={ticketUrl ?? ''}
      />

      {newChatConfirmationDialogOpen && (
        <AlertDialog
          title={t('newChat')}
          close={() => setNewChatConfirmationDialogOpen(false)}
          actions={
            <DialogActions>
              <Button onClick={cancelNewChat} variant='outlined' sx={{ flex: '1 1' }}>
                {t('layout:cancel')}
              </Button>
              <Button onClick={createNewChat} variant='contained' sx={{ flex: '3 3' }}>
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
