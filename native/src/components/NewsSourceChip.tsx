import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { Chip } from 'react-native-paper'
import { useTheme } from 'styled-components/native'

import { getNewsColor, getNewsSourceLabel, NewsSource } from 'shared/api'

import Text from './base/Text'

type NewsSourceChipProps = {
  source: NewsSource
}

const NewsSourceChip = ({ source }: NewsSourceChipProps): ReactElement => {
  const { t } = useTranslation('news')
  const theme = useTheme()
  const borderColor = getNewsColor({
    palette: { ...theme.colors, secondary: { main: theme.colors.secondary } },
    source,
  })

  const styles = StyleSheet.create({
    chip: {
      borderRadius: 32,
      borderColor,
      backgroundColor: theme.colors.background,
      alignSelf: 'flex-start',
    },
  })

  return (
    <Chip mode='outlined' style={styles.chip} compact>
      <Text variant='body2'>{getNewsSourceLabel({ source, t })}</Text>
    </Chip>
  )
}

export default NewsSourceChip
