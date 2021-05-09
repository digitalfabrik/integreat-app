import type { StoreActionType } from '../../app/StoreActionType'
import { config } from 'translations'

const contentLanguageReducer = (state: string = config.defaultFallback, action: StoreActionType): string => {
  if (action.type === 'SET_CONTENT_LANGUAGE') {
    return action.params.contentLanguage
  }

  return state
}

export default contentLanguageReducer
