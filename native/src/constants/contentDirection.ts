import { I18nManager } from 'react-native'

import { config } from 'translations'

export const isContentDirectionReversalRequired = (contentLanguage: string): boolean =>
  config.hasRTLScript(contentLanguage) !== I18nManager.isRTL
export const isRTL = (): boolean => I18nManager.isRTL
export const contentDirection = (contentLanguage: string): 'row' | 'row-reverse' =>
  isContentDirectionReversalRequired(contentLanguage) ? 'row-reverse' : 'row'
export const contentAlignment = (contentLanguage: string): 'right' | 'left' =>
  isContentDirectionReversalRequired(contentLanguage) ? 'right' : 'left'
export const isRTLText = (text: string): boolean => {
  const rtlCount = (text.match(/[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/g) || []).length
  const ltrCount = (
    text.match(
      // This rule checks for additional unicode characters of ltr languages and a-z
      // eslint-disable-next-line no-misleading-character-class -- https://github.com/eslint/eslint/issues/15080
      /[A-Za-z\u00C0-\u00C0\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF]/g
    ) || []
  ).length
  return rtlCount > ltrCount
}
export const contentAlignmentRTLText = (text: string): 'right' | 'left' => (isRTLText(text) ? 'right' : 'left')
