import Typography from '@mui/material/Typography'
import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

type LastUpdateInfoProps = {
  lastUpdate: DateTime
  withText: boolean
  format?: string
  className?: string
}

export const LastUpdateInfo = ({
  lastUpdate,
  withText,
  className,
  format = 'DDD',
}: LastUpdateInfoProps): ReactElement => {
  const { i18n, t } = useTranslation()
  return (
    <Typography variant='caption' className={className}>
      {withText && t($ => $.common.lastUpdate)} {lastUpdate.setLocale(i18n.language).toFormat(format)}
    </Typography>
  )
}

export default LastUpdateInfo
