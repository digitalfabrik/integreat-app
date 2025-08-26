import { styled } from '@mui/material/styles'
import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

const TimeStamp = styled('p')`
  color: ${props => props.theme.legacy.colors.textSecondaryColor};
  font-family: ${props => props.theme.legacy.fonts.web.contentFont};
  font-size: ${props => props.theme.legacy.fonts.contentFontSize};
`

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
  const { i18n, t } = useTranslation('common')
  return (
    <TimeStamp className={className}>
      {withText && t('lastUpdate')} {lastUpdate.setLocale(i18n.language).toFormat(format)}
    </TimeStamp>
  )
}

export default LastUpdateInfo
