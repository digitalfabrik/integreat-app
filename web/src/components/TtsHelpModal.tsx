import MenuBookIcon from '@mui/icons-material/MenuBook'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import DialogContentText from '@mui/material/DialogContentText'
import IconButton from '@mui/material/IconButton'
import MuiList from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import Dialog from './base/Dialog'
import Link from './base/Link'

const helpItemsData = [
  {
    title: 'Windows',
    path: 'https://support.microsoft.com/en-us/topic/download-languages-and-voices-for-immersive-reader-read-mode-and-read-aloud-4c83a8d8-7486-42f7-8e46-2b0fdf753130',
  },
  {
    title: 'MacOS',
    path: 'https://support.apple.com/guide/mac-help/change-the-voice-your-mac-uses-to-speak-text-mchlp2290/mac',
  },
  {
    title: 'Android',
    path: 'https://support.google.com/accessibility/android/answer/6006983?hl=en&sjid=9301509494880612166-EU',
  },
  {
    title: 'iOS',
    path: 'https://support.apple.com/en-us/HT202362',
  },
  {
    title: 'Linux',
    path: 'https://github.com/Elleo/pied',
  },
]

const HelpModalItem = ({ title, path }: { title: string; path: string }) => (
  <ListItem disablePadding>
    <ListItemButton component={Link} to={path}>
      <ListItemAvatar>
        <Avatar>
          <MenuBookIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={title} />
      <IconButton color='primary' disableRipple>
        <OpenInNewIcon />
      </IconButton>
    </ListItemButton>
  </ListItem>
)

const TtsHelpModal = ({ closeModal }: { closeModal: () => void }): ReactElement => {
  const { t } = useTranslation('layout')

  return (
    <Dialog title={t('voiceUnavailable')} closeModal={closeModal}>
      <DialogContentText>
        <Alert severity='warning'>{t('voiceUnavailableMessage')}</Alert>
      </DialogContentText>
      <MuiList>
        {helpItemsData.map(item => (
          <HelpModalItem key={item.title} title={item.title} path={item.path} />
        ))}
      </MuiList>
    </Dialog>
  )
}

export default TtsHelpModal
