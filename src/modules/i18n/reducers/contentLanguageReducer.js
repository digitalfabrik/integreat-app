// @flow

import type { SetContentLanguageActionType } from '../../app/StoreActionType'
import type { StateType } from '../../app/StateType'

const contentLanguageReducer = (
  state: StateType, action: SetContentLanguageActionType
): StateType => ({ contentLanguage: action.params.contentLanguage, ...state })

export default contentLanguageReducer
