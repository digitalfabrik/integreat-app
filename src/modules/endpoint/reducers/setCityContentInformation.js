// @flow

import type { CityContentStateType } from '../../app/StateType'
import type { SetCityContentInformationType } from '../../app/StoreActionType'
import { defaultCityContentState } from '../../app/StateType'

const setCityContentInformation = (state: CityContentStateType, action: SetCityContentInformationType): CityContentStateType => {
  if (state === defaultCityContentState) {
    const {language, city} = action.params
    return {...state, language, city}
  } else {
    return state
  }
}

export default setCityContentInformation
