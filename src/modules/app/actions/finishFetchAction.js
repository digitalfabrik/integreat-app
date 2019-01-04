// @flow

import { createAction } from 'redux-actions'
import { Payload } from '@integreat-app/integreat-api-client'
import type { PayloadDataType } from '../StoreActionType'

export type FinishFetchActionType = { type: string, payload: Payload<PayloadDataType> }

export const finishFetchActionName = (stateName: string): string => `FINISH_FETCH_${stateName.toUpperCase()}`

const finishFetchAction = (stateName: string, payload: Payload<PayloadDataType>): FinishFetchActionType =>
  createAction(finishFetchActionName(stateName))(payload)

export default finishFetchAction
