// @flow

export type ColorsType = {|
  themeColor: string,
  backgroundAccentColor: string,
  textColor: string,
  textSecondaryColor: string,
  textDecorationColor: string,
  textDisabledColor: string,
  backgroundColor: string,
  tunewsThemeColor: string,
  tunewsThemeColorLight: string
|}

export const commonLightColors: ColorsType = {
  backgroundAccentColor: '#fafafa',
  textColor: '#000000',
  textSecondaryColor: '#585858',
  textDecorationColor: '#c7c7c7',
  textDisabledColor: '#d0d0d0',
  backgroundColor: '#ffffff',
  tunewsThemeColor: '#007aa8',
  tunewsThemeColorLight: 'rgba(0, 122, 168, 0.4)'
}

export const commonDarkColors: ColorsType = {
  backgroundAccentColor: '#111111',
  textColor: '#BBBBBB',
  textSecondaryColor: '#888888',
  textDecorationColor: '#555555',
  textDisabledColor: '#444444',
  backgroundColor: '#222222',
  tunewsThemeColor: '#007aa8',
  tunewsThemeColorLight: 'rgba(0, 122, 168, 0.4)'
}
