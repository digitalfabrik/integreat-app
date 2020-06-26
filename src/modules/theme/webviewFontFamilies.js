// @flow

import type { ThemeType } from './constants/theme'

const ARABIC_LANGUAGES = ['ar', 'fa', 'ku']

const webviewFontFamilies = (theme: ThemeType, language: string) => {
  return ARABIC_LANGUAGES.includes(language) ? theme.fonts.arabicWebviewFontFamilies : theme.fonts.webviewFontFamilies
}

export default webviewFontFamilies
