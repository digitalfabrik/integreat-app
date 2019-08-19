// @flow

import type { StoreActionType } from '../../app/StoreActionType'
import { DEFAULT_LANGUAGE } from '../components/I18nProvider'

const contentLanguageReducer = (state: string = DEFAULT_LANGUAGE, action: StoreActionType): string => {
  if (action.type === 'SET_CONTENT_LANGUAGE') {
    return action.params.contentLanguage
  }
  return state
}

export default contentLanguageReducer
