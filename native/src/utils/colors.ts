import { CommonColorPalette, PaletteColor, PaletteMode } from 'build-configs/ThemeType'

const HEX_RADIX = 16
const MAX_CHANNEL_VALUE = 255
const ALERT_BACKGROUND_COEFFICIENT = 0.9
const ALERT_TEXT_COEFFICIENT = 0.6

const parseHex = (hex: string): number[] => {
  const value = hex.replace('#', '')
  const fullValue =
    value.length === 3
      ? value
          .split('')
          .map(char => char + char)
          .join('')
      : value
  return [0, 2, 4].map(index => parseInt(fullValue.slice(index, index + 2), HEX_RADIX))
}

const toHex = (channels: number[]): string =>
  `#${channels.map(channel => Math.trunc(channel).toString(HEX_RADIX).padStart(2, '0')).join('')}`.toUpperCase()

// Same calculations as the lighten and darken functions of mui
export const lighten = (hex: string, coefficient: number): string =>
  toHex(parseHex(hex).map(channel => channel + (MAX_CHANNEL_VALUE - channel) * coefficient))

export const darken = (hex: string, coefficient: number): string =>
  toHex(parseHex(hex).map(channel => channel * (1 - coefficient)))

export type AlertSeverity = 'success' | 'info' | 'warning' | 'error'

export type AlertColors = {
  icon: string
  background: string
  text: string
}

// Same colors as the standard mui alerts, see https://mui.com/material-ui/react-alert/
const alertColors = (color: PaletteColor, mode: PaletteMode): AlertColors => ({
  icon: color.main,
  background:
    mode === 'light'
      ? lighten(color.light, ALERT_BACKGROUND_COEFFICIENT)
      : darken(color.light, ALERT_BACKGROUND_COEFFICIENT),
  text: mode === 'light' ? darken(color.light, ALERT_TEXT_COEFFICIENT) : lighten(color.light, ALERT_TEXT_COEFFICIENT),
})

export const createAlertColors = (palette: CommonColorPalette): Record<AlertSeverity, AlertColors> => ({
  success: alertColors(palette.success, palette.mode),
  info: alertColors(palette.info, palette.mode),
  warning: alertColors(palette.warning, palette.mode),
  error: alertColors(palette.error, palette.mode),
})
