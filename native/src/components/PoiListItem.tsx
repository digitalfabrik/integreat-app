import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { List as PaperList } from 'react-native-paper'
import { useTheme } from 'styled-components/native'

import { PoiModel } from 'shared/api'

import { contentDirection } from '../constants/contentDirection'
import Text from './base/Text'

type PoiListItemProps = {
  poi: PoiModel
  language: string
  navigateToPoi: () => void
  distance: number | null
  onFocus: () => void
}

const PoiListItem = ({ poi, language, navigateToPoi, distance, onFocus }: PoiListItemProps) => {
  const { t } = useTranslation('pois')
  const theme = useTheme()

  const styles = StyleSheet.create({
    ListItemStyle: {
      flexDirection: contentDirection(language),
      paddingVertical: 16,
      backgroundColor: theme.colors.background,
    },
  })

  return (
    <PaperList.Item
      borderless
      title={<Text variant='h6'>{poi.title}</Text>}
      titleNumberOfLines={0}
      onPress={navigateToPoi}
      role='link'
      onFocus={onFocus}
      focusable
      style={styles.ListItemStyle}
      description={
        <View>
          {distance !== null && (
            <Text variant='caption' style={{ marginTop: 4 }}>
              {t('distanceKilometre', { distance: distance.toFixed(1) })}
            </Text>
          )}
          <Text
            variant='caption'
            style={{
              color: theme.colors.onSurfaceVariant,
              marginTop: 4,
            }}>
            {poi.category.name}
          </Text>
        </View>
      }
    />
  )
}

export default memo(PoiListItem)
