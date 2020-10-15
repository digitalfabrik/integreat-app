// @flow

import { createAction } from 'redux-actions'
import { Payload } from '@integreat-app/integreat-api-client'
import type { PayloadDataType } from '../PayloadDataType'

export type FinishFetchActionType<T: PayloadDataType, P> = { type: string, payload: Payload<T>, meta: P }

export const finishFetchActionName = (stateName: string): string => `FINISH_FETCH_${stateName.toUpperCase()}`

const finishFetchAction = <T: PayloadDataType, P> (
  stateName: string,
  payload: Payload<T>,
  meta: P
): FinishFetchActionType<T, P> => createAction(finishFetchActionName(stateName), () => payload, () => meta)()

export default finishFetchAction
