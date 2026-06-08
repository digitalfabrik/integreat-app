import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { encodeQR, QR_CODE_SIZE } from 'shared'

import AlertDialog from './base/AlertDialog'
import Svg from './base/Svg'

type QrCodeDialogProps = {
  open: boolean
  close: () => void
  title: string
  description: string
  content: string
}

const QrCodeDialog = ({ open, close, title, description, content }: QrCodeDialogProps): ReactElement | null => {
  const { t } = useTranslation('layout')
  const theme = useTheme()
  const svgSrc = `data:image/svg+xml,${encodeQR(content, 'svg')}`

  if (!open) {
    return null
  }

  return (
    <AlertDialog
      title={title}
      close={close}
      actions={
        <DialogActions>
          <Button onClick={close} variant='outlined'>
            {t('common:close')}
          </Button>
        </DialogActions>
      }>
      <Stack alignItems='center' gap={2}>
        <Typography variant='body2'>{description}</Typography>
        <Box
          sx={{
            color: theme.palette.text.primary,
            '& svg *': {
              fill: 'currentColor',
            },
          }}>
          <Svg src={svgSrc} width={QR_CODE_SIZE} height={QR_CODE_SIZE} />
        </Box>
        <Typography variant='body2' textAlign='center'>
          {content}
        </Typography>
      </Stack>
    </AlertDialog>
  )
}

export default QrCodeDialog
