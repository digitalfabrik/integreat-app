import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { contentDirection } from '../constants/contentDirection'

const TimeStampText = styled.Text`
  color: ${props => props.theme.legacy.colors.textSecondaryColor};
  font-family: ${props => props.theme.legacy.fonts.native.contentFontRegular};
`
const DirectionContainer = styled.View<{ language: string }>`
  display: flex;
  flex-direction: ${props => contentDirection(props.language)};
`

type TimeStampProps = {
  lastUpdate: DateTime
  showText?: boolean
  format?: string
}

export const TimeStamp = ({ lastUpdate, showText = true, format = 'DDD' }: TimeStampProps): ReactElement => {
  const { i18n, t } = useTranslation('common')
  return (
    <DirectionContainer language={i18n.language}>
      {showText && <TimeStampText>{t('lastUpdate')} </TimeStampText>}
      <TimeStampText>{lastUpdate.setLocale(i18n.language).toFormat(format)}</TimeStampText>
    </DirectionContainer>
  )
}

export default TimeStamp
