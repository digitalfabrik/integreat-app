// @flow

import type { StateType } from '../../../modules/app/StateType'
import { createSelector, type OutputSelector } from 'reselect'
import { citiesEndpoint } from '@integreat-app/integreat-api-client'
import CityModel from '@integreat-app/integreat-api-client/models/CityModel'

export type CitiesSelectorType = (state: StateType) => OutputSelector<StateType, {}, Array<CityModel>>

const citiesSelector: CitiesSelectorType = createSelector(
  (state): any => state.cities.json,
  (json: any) => citiesEndpoint.mapResponse(json)
)

export default citiesSelector
