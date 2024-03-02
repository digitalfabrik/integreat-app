import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const TimeStamp = styled.p`
  color: ${props => props.theme.colors.textSecondaryColor};
  font-family: ${props => props.theme.fonts.web.contentFont};
  font-size: ${props => props.theme.fonts.contentFontSize};
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
