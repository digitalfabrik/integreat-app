import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { contentDirection } from '../constants/contentDirection'
import Text from './base/Text'

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
  const theme = useTheme()
  const styles = StyleSheet.create({
    timeStampText: {
      color: theme.colors.onSurfaceVariant,
    },
  })

  return (
    <DirectionContainer language={i18n.language}>
      {showText && (
        <Text variant='caption' style={styles.timeStampText}>
          {t('lastUpdate')}
        </Text>
      )}
      <Text variant='caption' style={styles.timeStampText}>
        {lastUpdate.setLocale(i18n.language).toFormat(format)}
      </Text>
    </DirectionContainer>
  )
}

export default TimeStamp
