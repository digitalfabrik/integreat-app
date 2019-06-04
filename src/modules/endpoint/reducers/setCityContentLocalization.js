// @flow

import type { CityContentStateType } from '../../app/StateType'
import type { SetCityContentLocalizationType } from '../../app/StoreActionType'

const setCityContentLocalization = (state: CityContentStateType, action: SetCityContentLocalizationType): CityContentStateType => {
  if (!state.language || !state.city) {
    const {language, city} = action.params
    return {...state, language, city}
  } else {
    return state
  }
}

export default setCityContentLocalization
