// @flow

import type { CityContentStateType } from '../../app/StateType'
import type { SetCityContentInformationType } from '../../app/StoreActionType'

const setCityContentInformation = (state: CityContentStateType, action: SetCityContentInformationType): CityContentStateType => {
  if (!state.language || !state.city) {
    const {language, city} = action.params
    return {...state, language, city}
  } else {
    return state
  }
}

export default setCityContentInformation
