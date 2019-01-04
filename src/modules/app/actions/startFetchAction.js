// @flow

import { createAction } from 'redux-actions'
import { Payload } from '@integreat-app/integreat-api-client'
import type { PayloadDataType } from '../StoreActionType'

export type StartFetchActionType = { type: string, payload: Payload<PayloadDataType> }

export const startFetchActionName = (stateName: string): string => `START_FETCH_${stateName.toUpperCase()}`

const startFetchAction = (stateName: string, formattedUrl: string): StartFetchActionType => {
  const payload = new Payload(true, formattedUrl)
  return createAction(startFetchActionName(stateName))(payload)
}

export default startFetchAction
