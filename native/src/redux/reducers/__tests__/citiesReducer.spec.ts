import { CityModel, ErrorCode } from 'api-client'

import { CitiesStateType } from '../../StateType'
import { StoreActionType } from '../../StoreActionType'
import citiesReducer from '../citiesReducer'

describe('citiesReducer', () => {
  it('should set status to loading on FETCH_CITIES', () => {
    const prevState: CitiesStateType = {
      status: 'ready',
      models: [],
    }
    const action: StoreActionType = {
      type: 'FETCH_CITIES',
      params: {
        forceRefresh: false,
      },
    }
    expect(citiesReducer(prevState, action)).toEqual({
      status: 'loading',
    })
  })
  it('should set models on PUSH_CITIES', () => {
    const prevState: CitiesStateType = {
      status: 'loading',
    }
    const models = [
      new CityModel({
        name: 'Stadt Augsburg',
        code: 'augsburg',
        live: true,
        eventsEnabled: true,
        offersEnabled: true,
        poisEnabled: true,
        localNewsEnabled: false,
        tunewsEnabled: false,
        sortingName: 'augsburg',
        prefix: 'Stadt',
        aliases: null,
        latitude: 48.369696,
        longitude: 10.892578,
        boundingBox: null,
      }),
    ]
    expect(
      citiesReducer(prevState, {
        type: 'PUSH_CITIES',
        params: {
          cities: models,
        },
      })
    ).toEqual({
      status: 'ready',
      models,
    })
  })
  it('should set error status on FETCH_CITIES_FAILED', () => {
    const prevState: CitiesStateType = {
      status: 'loading',
    }
    const errorMessage = 'Some Error'
    expect(
      citiesReducer(prevState, {
        type: 'FETCH_CITIES_FAILED',
        params: {
          message: errorMessage,
          code: ErrorCode.UnknownError,
        },
      })
    ).toEqual({
      status: 'error',
      message: errorMessage,
      code: ErrorCode.UnknownError,
    })
  })
})
