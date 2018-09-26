// @flow

import { createAction } from 'redux-actions'
import type { SetCurrentCityActionType } from '../../../modules/app/StoreActionType'

export default (city: string): SetCurrentCityActionType => createAction('SET_CURRENT_CITY')(city)
