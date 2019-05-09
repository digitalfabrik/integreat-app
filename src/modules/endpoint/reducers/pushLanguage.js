// @flow

import type { CityContentStateType } from '../../app/StateType'
import type { PushContentLanguageActionType } from '../../app/StoreActionType'

const pushLanguage = (state: CityContentStateType, action: PushContentLanguageActionType): CityContentStateType => {
  const {newLanguage} = action.params

  return {
    ...state,
    language: newLanguage
  }
}

export default pushLanguage
