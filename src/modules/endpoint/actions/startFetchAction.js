// @flow

import { createAction } from 'redux-actions'
import Payload from '../Payload'

export const startFetchActionName = (stateName: string): string => `START_FETCH_${stateName.toUpperCase()}`

const startFetchAction = (stateName: string, formattedUrl: string) =>
  createAction(startFetchActionName(stateName))(new Payload(true, formattedUrl))

export default startFetchAction
