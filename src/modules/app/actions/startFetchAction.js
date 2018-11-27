// @flow

import { createAction } from 'redux-actions'
import { Payload } from '@integreat-app/integreat-api-client'

export const startFetchActionName = (stateName: string): string => `START_FETCH_${stateName.toUpperCase()}`

const startFetchAction = <T> (stateName: string, formattedUrl: string): { type: string, payload: Payload<T> } => {
  const payload = new Payload<T>(true, formattedUrl)
  return createAction(startFetchActionName(stateName))(payload)
}

export default startFetchAction
