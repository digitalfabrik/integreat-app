// @flow

import { createAction } from 'redux-actions'
import Payload from '../Payload'

export const finishFetchActionName = (stateName: string): string => `FINISH_FETCH_${stateName.toUpperCase()}`

const finishFetchAction = (stateName: string, payload: Payload) => createAction(
  finishFetchActionName(stateName)
)(payload)

export default finishFetchAction
