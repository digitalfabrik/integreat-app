// @flow

import { sortBy } from 'lodash/collection'

import CityModel from '../models/CityModel'
import { apiUrl } from '../constants'
import type { Dispatch } from 'redux-first-router/dist/flow-types'
import { saveCities } from '../actions/fetcher'
import { goToNotFound } from '../../app/routes/notFound'
import { redirect } from 'redux-first-router'

type Params = {city: ?string}

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
      dispatch(saveCities(cities))
      return cities
    }).then(cities => {
      if (params.city && !cities.find(_city => _city.code === params.city)) {
        dispatch(redirect(goToNotFound(params.city)))
      }
      return cities
    })

export default fetcher
