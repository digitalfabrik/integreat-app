import type { Location, LocationState, RoutesMap } from "redux-first-router";

/**
 * Testing utility to create a new Location object accepted by flow
 */
const createLocation = ({
  pathname,
  payload,
  type,
  query,
  prev,
  routesMap
}: {
  pathname?: string;
  payload: Record<string, any>;
  type: string;
  query?: Record<string, any>;
  prev?: Location;
  routesMap?: RoutesMap;
}): LocationState => ({
  pathname: pathname || '/random_pathname',
  type,
  payload,
  query: query || {},
  prev: prev || {
    pathname: '/random_prev_pathname',
    payload: {},
    type: 'RANDOM_PREV_TYPE'
  },
  routesMap: routesMap || {},
  kind: undefined,
  history: undefined
});

export default createLocation;