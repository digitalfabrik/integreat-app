import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { encodeQR, QR_CODE_SIZE } from 'shared'

import AlertDialog from './base/AlertDialog'
import Svg from './base/Svg'

const StyledSvg = styled(Svg)({
  fill: 'currentColor',
})

type QrCodeDialogProps = {
  open: boolean
  close: () => void
  title: string
  description: string
  content: string
}

const QrCodeDialog = ({ open, close, title, description, content }: QrCodeDialogProps): ReactElement | null => {
  const { t } = useTranslation('layout')
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

        <StyledSvg src={svgSrc} width={QR_CODE_SIZE} height={QR_CODE_SIZE} ariaLabel={t('qrCode')} />

        <Typography variant='body2' textAlign='center'>
          {content}
        </Typography>
      </Stack>
    </AlertDialog>
  )
}

export default QrCodeDialog
