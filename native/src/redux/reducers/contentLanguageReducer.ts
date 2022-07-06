import { config } from 'translations'

import { StoreActionType } from '../StoreActionType'

// Necessary for reducers
// eslint-disable-next-line default-param-last
const contentLanguageReducer = (state: string = config.defaultFallback, action: StoreActionType): string => {
  if (action.type === 'SET_CONTENT_LANGUAGE') {
    return action.params.contentLanguage
  }

  return state
}

export default contentLanguageReducer
