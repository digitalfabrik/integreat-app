// @flow

import { createAction } from 'redux-actions'
import type { Dispatch, GetState } from 'redux-first-router'
import pointsOfInterestEndpoint from '../../endpoint/endpoints/pointsOfInterest'

export const POINTS_OF_INTEREST_ROUTE = 'POINTS_OF_INTEREST'

export const goToPointsOfInterest = (city: string, language: string, pointOfInterestId: ?string) =>
  createAction(POINTS_OF_INTEREST_ROUTE)({city, language, pointOfInterestId})

export const getPointsOfInterestPath = (city: string, language: string, pointOfInterestId: ?string): string =>
  `/${city}/${language}/poi${pointOfInterestId ? `/${pointOfInterestId}` : ''}`

export const pointsOfInterestRoute = {
  path: '/:city/:language/poi/:pointOfInterestId?',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await pointsOfInterestEndpoint.loadData(dispatch, state.pointsOfInterest, {city, language})
  }
}
