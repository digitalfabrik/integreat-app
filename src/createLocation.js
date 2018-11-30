// @flow

import type { LocationState, Location } from 'redux-first-router'
import { routesMap } from './modules/app/route-configs'

const createLocation = ({pathname, payload, type, query, prev}: {|
  pathname?: string, payload: Object, type: string, query?: Object, prev?: Location|}): LocationState => ({
  pathname: pathname || '/random_pathname',
  type,
  payload,
  query: query || {},
  prev: prev || {pathname: '/random_prev_pathname', payload: {}, type: 'RANDOM_PREV_TYPE'},
  routesMap,
  kind: undefined,
  history: undefined
})

export default createLocation
