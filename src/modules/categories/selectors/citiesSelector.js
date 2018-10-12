// @flow

import type { StateType } from '../../../modules/app/StateType'
import { createSelector } from 'reselect'
import citiesEndpoint from '../../../modules/endpoint/endpoints/cities'

const citiesJsonSelector = (state: StateType) => state.cities.json

const citiesSelector = createSelector(
  citiesJsonSelector,
  json => citiesEndpoint.mapResponse(json)
)

export default citiesSelector
