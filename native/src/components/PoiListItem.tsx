import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components/native'

import { PoiModel } from 'shared/api'

import { contentDirection } from '../constants/contentDirection'
import Pressable from './base/Pressable'
import Text from './base/Text'

const StyledPressable = styled(Pressable)<{ language: string }>`
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.onSurfaceDisabled};
  flex-direction: ${props => contentDirection(props.language)};
  padding: 16px 0;
  background-color: ${props => props.theme.colors.background};
`

const Description = styled.View`
  flex: 1;
  flex-direction: column;
  color: ${props => props.theme.colors.onSurface};
  font-family: ${props => props.theme.legacy.fonts.native.decorativeFontRegular};
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

  return (
    <StyledPressable onPress={navigateToPoi} language={language} role='link' onFocus={onFocus} focusable>
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
    </StyledPressable>
  )
}

export default memo(PoiListItem)
