// @flow

import { I18nManager } from 'react-native'
import { RTL_LANGUAGES } from '../i18n/components/I18nProvider'

export const isContentDirectionReversalRequired = (contentLanguage: string): boolean =>
  RTL_LANGUAGES.includes(contentLanguage) !== I18nManager.isRTL

export const contentDirection = (contentLanguage: string): 'row' | 'row-reverse' =>
  isContentDirectionReversalRequired(contentLanguage) ? 'row-reverse' : 'row'
