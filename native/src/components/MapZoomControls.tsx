import type { CameraRef, MapRef } from '@maplibre/maplibre-react-native'
import React, { ReactElement, Ref, RefObject, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { findNodeHandle, Pressable, StyleSheet, type StyleProp, View, type ViewStyle } from 'react-native'
import { useTheme } from 'styled-components/native'

import { animationDuration } from 'shared'

import Icon from './base/Icon'

// 50px location button height + 16px margin + 8px gap
const locationButtonOffset = 74

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 0,
    gap: 8,
  },
  button: {
    marginRight: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
})

type FocusedButtonProps = {
  children: ReactElement
  accessibilityLabel: string
  ref?: Ref<View>
  style?: StyleProp<ViewStyle>
  onPress: () => void
  nextFocusForward?: number
}

const FocusedButton = ({ children, accessibilityLabel, ref, style, onPress, nextFocusForward }: FocusedButtonProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const theme = useTheme()

  return (
    <Pressable
      ref={ref}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onPress={isFocused ? onPress : undefined}
      accessibilityLabel={accessibilityLabel}
      // @ts-expect-error Pressable doesn't have a type for nextFocusForward but it is a valid prop
      nextFocusForward={nextFocusForward}
      style={[styles.button, style, { backgroundColor: theme.colors.surface, opacity: isFocused ? 1 : 0 }]}>
      {children}
    </Pressable>
  )
}

type MapZoomControlsProps = {
  mapRef: RefObject<MapRef | null>
  cameraRef: RefObject<CameraRef | null>
  bottomSheetHeight: number
  ref?: Ref<View>
}

const MapZoomControls = ({ mapRef, cameraRef, bottomSheetHeight, ref }: MapZoomControlsProps): ReactElement => {
  const { t } = useTranslation('pois')
  const theme = useTheme()
  const [zoomOutFocusTarget, setZoomOutFocusTarget] = useState<number | undefined>(undefined)

  const handleZoomOutRef = useCallback((view: View | null) => {
    setZoomOutFocusTarget(findNodeHandle(view) ?? undefined)
  }, [])

  const zoom = async (delta: number) => {
    if (mapRef.current === null || cameraRef.current === null) {
      return
    }
    const currentZoom = await mapRef.current.getZoom()
    cameraRef.current.zoomTo(currentZoom + delta, { duration: animationDuration, easing: 'ease' })
  }

  return (
    <View style={[styles.container, { bottom: bottomSheetHeight + locationButtonOffset }]}>
      <FocusedButton
        onPress={() => zoom(1)}
        accessibilityLabel={t('zoomIn')}
        ref={ref}
        nextFocusForward={zoomOutFocusTarget}>
        <Icon source='plus' color={theme.colors.onSurface} />
      </FocusedButton>
      <FocusedButton onPress={() => zoom(-1)} accessibilityLabel={t('zoomOut')} ref={handleZoomOutRef}>
        <Icon source='minus' color={theme.colors.onSurface} />
      </FocusedButton>
    </View>
  )
}

export default MapZoomControls
