// @flow

import type { CityContentStateType } from '../../app/StateType'
import type { PushLanguagesActionType } from '../../app/StoreActionType'

const pushLanguages = (state: CityContentStateType, action: PushLanguagesActionType): CityContentStateType => {
  const {language, city, languages} = action.params

  return {
    ...state,
    language,
    city,
    languages
  }
}

export default pushLanguages
