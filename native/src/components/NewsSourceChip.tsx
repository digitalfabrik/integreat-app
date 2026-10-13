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

  const label = getNewsSourceLabel({ source, t })
  const [color, contrastColor] = getNewsColor({
    palette: { ...theme.colors, secondary: { main: theme.colors.secondary, contrastText: theme.colors.onSecondary } },
    source,
  })

  return (
    <Chip style={[styles.chip, { borderColor: color, backgroundColor: color }]} compact>
      <Text variant='body2' style={{ color: contrastColor }}>
        {label}
      </Text>
    </Chip>
  )
}

export default NewsSourceChip
