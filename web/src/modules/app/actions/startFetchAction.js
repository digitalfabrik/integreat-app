// @flow

import { createAction } from 'redux-actions'
import { Payload } from 'api-client'

export type StartFetchActionType<T> = { type: string, payload: Payload<*>, meta: T }

export const startFetchActionName = (stateName: string): string => `START_FETCH_${stateName.toUpperCase()}`

const startFetchAction = <T> (stateName: string, formattedUrl: string, meta: T): StartFetchActionType<T> => {
  const payload = new Payload(true, formattedUrl)
  return createAction(startFetchActionName(stateName), () => payload, () => meta)()
}

export default startFetchAction
