// @flow

import { createAction } from 'redux-actions'
import { Payload } from '@integreat-app/integreat-api-client'

export const finishFetchActionName = (stateName: string): string => `FINISH_FETCH_${stateName.toUpperCase()}`

const finishFetchAction = <T> (stateName: string, payload: Payload<T>): { type: string, payload: Payload<T> } =>
  createAction(finishFetchActionName(stateName))(payload)

export default finishFetchAction
