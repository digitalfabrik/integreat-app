// @flow

import { type ActionType, handleAction } from 'redux-actions'
import setCurrentCity from '../actions/setCurrentCity'
import type { CurrentCityStateType } from '../../../modules/app/StateType'

export default handleAction(
  'SET_CURRENT_CITY',
  (state: CurrentCityStateType, {payload}: ActionType<typeof setCurrentCity>) => payload,
  null
)
