// @flow

import { createAction } from 'redux-actions'
import { Payload } from '@integreat-app/integreat-api-client'
import type { PayloadDataType } from '../PayloadDataType'

export type FinishFetchActionType<T: PayloadDataType> = { type: string, payload: Payload<T> }

export const finishFetchActionName = (stateName: string): string => `FINISH_FETCH_${stateName.toUpperCase()}`

const finishFetchAction = <T: PayloadDataType> (stateName: string, payload: Payload<PayloadDataType>
): FinishFetchActionType<T> => createAction(finishFetchActionName(stateName))(payload)

export default finishFetchAction
