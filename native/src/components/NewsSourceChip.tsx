import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { Chip } from 'react-native-paper'
import { useTheme } from 'styled-components/native'

import { getNewsColor, getNewsSourceLabel, NewsSource } from 'shared/api'

import Text from './base/Text'

const styles = StyleSheet.create({
  chip: {
    borderRadius: 32,
    alignSelf: 'flex-start',
  },
})

type NewsSourceChipProps = {
  source: NewsSource
}

const NewsSourceChip = ({ source }: NewsSourceChipProps): ReactElement => {
  const { t } = useTranslation()
  const theme = useTheme()

  const label = getNewsSourceLabel({ source, localNewsLabel: t($ => $.news.local) })
  const borderColor = getNewsColor({
    palette: { ...theme.colors, secondary: { main: theme.colors.secondary } },
    source,
  })

  return (
    <Chip mode='outlined' style={[styles.chip, { borderColor, backgroundColor: theme.colors.background }]} compact>
      <Text variant='body2'>{label}</Text>
    </Chip>
  )
}

export default NewsSourceChip
