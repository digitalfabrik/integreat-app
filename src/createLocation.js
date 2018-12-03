// @flow

import type { RoutesMap, LocationState, Location } from 'redux-first-router'

const createLocation = ({pathname, payload, type, query, prev, routesMap}: {|pathname?: string, payload: Object,
  type: string, query?: Object, prev?: Location, routesMap?: RoutesMap|}): LocationState => ({
  pathname: pathname || '/random_pathname',
  type,
  payload,
  query: query || {},
  prev: prev || {pathname: '/random_prev_pathname', payload: {}, type: 'RANDOM_PREV_TYPE'},
  routesMap: routesMap || {},
  kind: undefined,
  history: undefined
})

export default createLocation
