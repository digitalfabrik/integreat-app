// @flow

import { type ActionType, handleAction, type ReduxReducer } from 'redux-actions'
import setCurrentCity from '../actions/setCurrentCity'
import type { CurrentCityStateType } from '../../../modules/app/StateType'
import type { SetCurrentCityActionType } from '../../app/StoreActionType'

const setCurrentCityReducer: ReduxReducer<?string, SetCurrentCityActionType> =
  handleAction(
    'SET_CURRENT_CITY',
    (state: CurrentCityStateType, { payload }: ActionType<typeof setCurrentCity>) => payload,
    null
  )

export default setCurrentCityReducer
