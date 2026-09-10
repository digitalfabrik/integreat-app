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
  const formattedDate = lastUpdate.setLocale(i18n.language).toFormat(format)
  return (
    <Typography variant='caption' className={className}>
      {withText ? t($ => $.common.state.updatedAt, { date: formattedDate }) : formattedDate}
    </Typography>
  )
}

export default LastUpdateInfo
