import { I18nManager } from 'react-native'
import { config } from 'translations'
export const isContentDirectionReversalRequired = (contentLanguage: string): boolean =>
  config.hasRTLScript(contentLanguage) !== I18nManager.isRTL
export const isRTL = (): boolean => I18nManager.isRTL
export const contentDirection = (contentLanguage: string): 'row' | 'row-reverse' =>
  isContentDirectionReversalRequired(contentLanguage) ? 'row-reverse' : 'row'
export const contentAlignment = (contentLanguage: string): 'right' | 'left' =>
  isContentDirectionReversalRequired(contentLanguage) ? 'right' : 'left'
