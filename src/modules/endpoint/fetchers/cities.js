// @flow

import { createAction } from 'redux-actions'
import { sortBy } from 'lodash/collection'

import CityModel from '../models/CityModel'
import { apiUrl } from '../constants'
import type { Dispatch } from 'redux-first-router/dist/flow-types'

type Params = {city: ?string}

const CITIES_FETCHED = 'CITIES_FETCHED'
const CITIES_NOT_FOUND = 'CITIES_NOT_FOUND'

const urlMapper = (): string => `${apiUrl}/wp-json/extensions/v1/multisites`

const stripSlashes = path => {
  if (path.startsWith('/')) {
    path = path.substr(1)
  }
  if (path.endsWith('/')) {
    path = path.substr(0, path.length - 1)
  }
  return path
}

const fetcher = (dispatch: Dispatch, params: Params): Promise<Array<CityModel>> =>
  fetch(urlMapper())
    .then(response => response.json())
    .then(json => {
      const cities = json
        .map(_city => new CityModel({
          name: _city.name,
          code: stripSlashes(_city.path),
          live: _city.live,
          eventsEnabled: _city['ige-evts'] === '1',
          extrasEnabled: true // todo
        }))
        .sort(_city => _city.name)
      return sortBy(cities, _city => _city.sortKey)
    })
    .then(cities => {
      dispatch(createAction(CITIES_FETCHED)(cities))
      return cities
    }).then(cities => {
      if (params.city && !cities.find(_city => _city.code === params.city)) {
        dispatch(createAction(CITIES_NOT_FOUND)(params.city))
      }
      return cities
    })

export default fetcher
