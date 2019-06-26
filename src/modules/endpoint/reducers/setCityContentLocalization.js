// @flow

import type { CityContentStateType } from '../../app/StateType'
import type { SetCityContentLocalizationType } from '../../app/StoreActionType'

const setCityContentLocalization = (
  state: CityContentStateType | null, action: SetCityContentLocalizationType
): CityContentStateType => {
  const {language, city} = action.params
  return {...state, language, city}
}

export default setCityContentLocalization
