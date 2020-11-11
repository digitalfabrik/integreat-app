// @flow

import { createAction } from 'redux-actions'
import { Payload } from 'api-client'
import type { PayloadDataType } from '../../../modules/app/PayloadDataType'

export type StartFetchMoreActionType<T: PayloadDataType> = { type: string, payload: Payload<T> }

export const startFetchMoreActionName = (stateName: string): string => `START_FETCH_MORE_${stateName.toUpperCase()}`

const startFetchMoreAction = <T: PayloadDataType> (stateName: string, formattedUrl: string): StartFetchMoreActionType<T> => {
  const payload = new Payload<T>(true, formattedUrl)
  return createAction(startFetchMoreActionName(stateName))(payload)
}

export default startFetchMoreAction
