// @flow

import type { CityContentStateType } from '../../app/StateType'
import type { SetContentLanguageActionType } from '../../app/StoreActionType'

const setLanguage = (state: CityContentStateType, action: SetContentLanguageActionType): CityContentStateType => {
  const {newLanguage} = action.params

  return {
    ...state,
    language: newLanguage
  }
}

export default setLanguage
