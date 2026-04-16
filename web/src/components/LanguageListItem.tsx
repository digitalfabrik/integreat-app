import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import Link from './base/Link'

const SelectorItemButton = styled(ListItemButton)`
  height: 48px;
  min-width: 112px;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  text-align: center;
` as typeof ListItemButton

const UnavailableSelectorItemButton = styled(SelectorItemButton)`
  justify-content: space-between;
  gap: 8px;
`

type SelectorProps = {
  code: string
  path: string | null
  name: string
  close?: () => void
  selectedLanguageCode?: string
  onUnavailableLanguageClick?: () => void
}

const LanguageListItem = ({
  code,
  path,
  name,
  close,
  selectedLanguageCode,
  onUnavailableLanguageClick,
}: SelectorProps): ReactElement => {
  const { palette } = useTheme()

  return path ? (
    <ListItem key={code} disablePadding>
      <SelectorItemButton
        component={Link}
        to={path}
        aria-selected={code === selectedLanguageCode}
        onClick={close}
        selected={code === selectedLanguageCode}>
        <Typography variant='body1' fontWeight={code === selectedLanguageCode ? 'bold' : 'normal'}>
          {name}
        </Typography>
      </SelectorItemButton>
    </ListItem>
  ) : (
    <ListItem disablePadding>
      <UnavailableSelectorItemButton onClick={onUnavailableLanguageClick}>
        <Typography variant='body1' color={palette.text.disabled} noWrap>
          {name}
        </Typography>
        <InfoOutlinedIcon fontSize='small' color='disabled' />
      </UnavailableSelectorItemButton>
    </ListItem>
  )
}

export default LanguageListItem
