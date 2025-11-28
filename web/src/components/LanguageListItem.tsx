import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import Link from './base/Link'

const SelectorItemButton = styled(ListItemButton)`
  height: 48px;
  min-width: 112px;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  text-align: center;
` as typeof ListItemButton

type SelectorProps = {
  code: string
  path: string | null
  name: string
  close?: () => void
  selectedLanguageCode?: string
}

const LanguageListItem = ({ code, path, name, close, selectedLanguageCode }: SelectorProps): ReactElement => {
  const { t } = useTranslation('layout')
  const { contentDirection } = useTheme()

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
    <Tooltip key={code} title={t('noTranslation')} placement={contentDirection === 'ltr' ? 'right' : 'left'}>
      <ListItem disablePadding>
        <SelectorItemButton disabled>{name}</SelectorItemButton>
      </ListItem>
    </Tooltip>
  )
}

export default LanguageListItem
