// @flow

import type { SetContentLanguageActionType } from '../../app/StoreActionType'
import { DEFAULT_LANGUAGE } from '../components/I18nProvider'

const contentLanguageReducer = (state: string = DEFAULT_LANGUAGE, action: SetContentLanguageActionType): string => {
  return action.params.contentLanguage
}

export default contentLanguageReducer
