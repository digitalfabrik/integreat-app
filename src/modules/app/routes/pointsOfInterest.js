// @flow

import { createAction } from 'redux-actions'
import type { Dispatch, GetState } from 'redux-first-router'
import pointsOfInterest from '../../endpoint/endpoints/pointsOfInterest'

export const POINTS_OF_INTEREST_ROUTE = 'POINTS_OF_INTEREST'

export const goToPointsOfInterest = (city: string, language: string, pointsOfInterestId: ?string) =>
  createAction(POINTS_OF_INTEREST_ROUTE)({city, language, pointsOfInterestId})

export const getPointsOfInterestPath = (city: string, language: string, pointsOfInterestId: ?string): string =>
  `/${city}/${language}/poi${pointsOfInterestId ? `/${pointsOfInterestId}` : ''}`

export const pointsOfInterestRoute = {
  path: '/:city/:language/poi/:pointsOfInterestId?',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await pointsOfInterest.loadData(dispatch, state.pointsOfInterest, {city, language})
  }
}
