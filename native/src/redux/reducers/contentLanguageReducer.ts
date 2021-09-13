import { config } from 'translations'

import { StoreActionType } from '../StoreActionType'

const contentLanguageReducer = (state: string = config.defaultFallback, action: StoreActionType): string => {
  if (action.type === 'SET_CONTENT_LANGUAGE') {
    return action.params.contentLanguage
  }

  return state
}

export default contentLanguageReducer
