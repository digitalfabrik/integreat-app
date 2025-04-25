export type ColorsType = {
  themeColor: string
  themeColorLight: string
  backgroundAccentColor: string
  textColor: string
  textSecondaryColor: string
  textDecorationColor: string
  textDisabledColor: string
  footerLineColor: string
  backgroundColor: string
  tunewsThemeColor: string
  tunewsThemeColorLight: string
  borderColor: string
  positiveHighlight: string
  negativeHighlight: string
  invalidInput: string
  warningColor: string
  linkColor: string
  themeContrast: string
  ttsPlayerWarningBackground: string
  ttsPlayerWarningColor: string
  ttsPlayerBackground: string
  ttsPlayerPlayIconColor: string
}
export const commonLightColors = {
  backgroundAccentColor: '#fafafa',
  textColor: '#000000',
  textSecondaryColor: '#585858',
  textDecorationColor: '#c7c7c7',
  textDisabledColor: '#d0d0d0',
  footerLineColor: '#b1b1b1',
  backgroundColor: '#ffffff',
  tunewsThemeColor: '#007aa8',
  tunewsThemeColorLight: 'rgba(0, 122, 168, 0.4)',
  borderColor: '#F1F1F1',
  positiveHighlight: '#188038',
  negativeHighlight: '#8b0000',
  invalidInput: '#B3261E',
  warningColor: '#FFA726',
  linkColor: '#0b57d0',
  ttsPlayerWarningBackground: '#fffde6',
  ttsPlayerWarningColor: '#f97c00',
  ttsPlayerBackground: '#dedede',
  ttsPlayerPlayIconColor: '#232323',
}
export const commonContrastColors = {
  ...commonLightColors,
  backgroundAccentColor: '#20293A',
  textColor: '#FFFFFF',
  textSecondaryColor: '#FFFFFF',
  backgroundColor: '#101217',
  borderColor: '#FFFFFF',
  positiveHighlight: '#22c253',
  negativeHighlight: '#FF3636',
  invalidInput: '#FF3636',
  linkColor: '#3B82F6',
}
