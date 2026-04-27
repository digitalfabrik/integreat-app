import React, { ReactElement, Ref, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, type StyleProp, type View, type ViewStyle } from 'react-native'
import { useTheme } from 'styled-components/native'

import Icon from './base/Icon'

// 50px button height + 16px margin
const buttonSpacing = 66

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 0,
    margin: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

type FocusedButtonProps = {
  children: ReactElement
  accessibilityLabel: string
  ref?: Ref<View>
  style?: StyleProp<ViewStyle>
  onPress: () => void
}

const FocusedButton = ({ children, accessibilityLabel, ref, style, onPress }: FocusedButtonProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const theme = useTheme()

  return (
    <Pressable
      ref={ref}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onPress={isFocused ? onPress : undefined}
      accessibilityLabel={accessibilityLabel}
      style={[styles.button, style, { backgroundColor: theme.colors.surface, opacity: isFocused ? 1 : 0 }]}>
      {children}
    </Pressable>
  )
}

type MapZoomControlsProps = {
  onZoomIn: () => void
  onZoomOut: () => void
  bottomSheetHeight: number
  zoomInRef?: Ref<View>
}

const MapZoomControls = ({ onZoomIn, onZoomOut, bottomSheetHeight, zoomInRef }: MapZoomControlsProps): ReactElement => {
  const { t } = useTranslation('pois')
  const theme = useTheme()

  return (
    <>
      <FocusedButton
        style={{ bottom: bottomSheetHeight + buttonSpacing }}
        onPress={onZoomOut}
        accessibilityLabel={t('zoomOut')}>
        <Icon source='minus' color={theme.colors.onSurface} />
      </FocusedButton>
      <FocusedButton
        style={{ bottom: bottomSheetHeight + buttonSpacing * 2 }}
        onPress={onZoomIn}
        accessibilityLabel={t('zoomIn')}
        ref={zoomInRef}>
        <Icon source='plus' color={theme.colors.onSurface} />
      </FocusedButton>
    </>
  )
}

export default MapZoomControls
