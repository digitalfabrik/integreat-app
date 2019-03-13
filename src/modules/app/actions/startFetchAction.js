// @flow

import { createAction } from 'redux-actions'
import { Payload } from '@integreat-app/integreat-api-client'
import type { PayloadDataType } from '../PayloadDataType'

export type StartFetchActionType<T: PayloadDataType> = { type: string, payload: Payload<T> }

export const startFetchActionName = (stateName: string): string => `START_FETCH_${stateName.toUpperCase()}`

const startFetchAction = <T: PayloadDataType> (stateName: string, formattedUrl: string): StartFetchActionType<T> => {
  const payload = new Payload<T>(true, formattedUrl)
  return createAction(startFetchActionName(stateName))(payload)
}

export default startFetchAction
