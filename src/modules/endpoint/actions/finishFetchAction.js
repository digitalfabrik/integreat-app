// @flow

import { createAction } from 'redux-actions'
import Payload from '../Payload'

import type { Action } from 'redux-first-router/dist/flow-types'

export const finishFetchActionName = (stateName: string): string => `FINISH_FETCH_${stateName.toUpperCase()}`

const finishFetchAction = (stateName: string, payload: Payload): Action => createAction(
  finishFetchActionName(finishFetchActionName(stateName)))(payload)

export default finishFetchAction
