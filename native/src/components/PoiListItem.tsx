import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import { PoiModel } from 'shared/api'

import { contentDirection } from '../constants/contentDirection'
import Text from './base/Text'

const Description = styled.View`
  flex: 1;
  flex-direction: column;
  padding: 0 8px;
  justify-content: center;
`

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
    TouchableRippleStyle: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.onSurfaceDisabled,
      flexDirection: contentDirection(language),
      paddingVertical: 16,
      backgroundColor: theme.colors.background,
    },
  })

  return (
    <TouchableRipple
      borderless
      onPress={navigateToPoi}
      role='link'
      onFocus={onFocus}
      focusable
      style={styles.TouchableRippleStyle}>
      <Description>
        <Text variant='h6'>{poi.title}</Text>
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
      </Description>
    </TouchableRipple>
  )
}

export default memo(PoiListItem)
