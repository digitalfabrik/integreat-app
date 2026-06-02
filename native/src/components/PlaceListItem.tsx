import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { List as PaperList } from 'react-native-paper'
import { useTheme } from 'styled-components/native'

import { PlaceModel } from 'shared/api'

import { contentDirection } from '../constants/contentDirection'
import Text from './base/Text'

type PlaceListItemProps = {
  place: PlaceModel
  language: string
  navigateToPlace: () => void
  distance: number | null
  onFocus: () => void
  visible: boolean
}

const PlaceListItem = ({ place, language, navigateToPlace, distance, onFocus, visible }: PlaceListItemProps) => {
  const { t } = useTranslation('places')
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
      title={<Text variant='h6'>{place.title}</Text>}
      titleNumberOfLines={0}
      onPress={navigateToPlace}
      role='link'
      onFocus={onFocus}
      accessible={visible}
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
            {place.category.name}
          </Text>
        </View>
      }
    />
  )
}

export default memo(PlaceListItem)
