// @flow

import Payload from './Payload'
import LoadingError from './errors/LoadingError'
import MappingError from './errors/MappingError'
import ParamMissingError from './errors/ParamMissingError'
import type { MapResponseType } from './MapResponseType'
import type { MapParamsToUrlType } from './MapParamsToUrlType'
import { call, fork, put, takeLatest, all } from 'redux-saga/effects'
import type { Saga } from 'redux-saga'
import { networkEventsListenerSaga } from 'react-native-offline'

type ActionType<P> = {
  +type: string,
  +params: P
}

/**
 * A Endpoint holds all the relevant information to fetch data from it
 */
class Endpoint<P, T> {
  _stateName: string
  mapParamsToUrl: MapParamsToUrlType<P>
  mapResponse: MapResponseType<P, T>
  responseOverride: ?T
  errorOverride: ?Error

  constructor (name: string, mapParamsToUrl: MapParamsToUrlType<P>, mapResponse: MapResponseType<P, T>, responseOverride: ?T, errorOverride: ?Error) {
    this.mapParamsToUrl = mapParamsToUrl
    this.mapResponse = mapResponse
    this.responseOverride = responseOverride
    this.errorOverride = errorOverride
    this._stateName = name
  }

  get stateName (): string {
    return this._stateName
  }

  async _loadData (params: P): Promise<Payload<T>> {
    let formattedUrl
    try {
      const responseOverride = this.responseOverride
      const errorOverride = this.errorOverride

      formattedUrl = this.mapParamsToUrl(params)

      if (errorOverride) {
        return new Payload(false, formattedUrl, null, errorOverride)
      }
      if (responseOverride) {
        const data = this.mapResponse(responseOverride, params)
        return new Payload(false, formattedUrl, data, null)
      }

      return await this._fetchData(formattedUrl, params)
    } catch (e) {
      let error
      if (e instanceof LoadingError || e instanceof ParamMissingError || e instanceof MappingError) {
        error = e
      } else {
        error = new LoadingError({endpointName: this.stateName, message: e.message})
      }

      console.error(error)
      return new Payload(false, formattedUrl, null, error)
    }
  }

  async _fetchData (formattedUrl: string, params: P): Promise<Payload<T>> {
    const response = await fetch(formattedUrl)
    if (!response.ok) {
      throw new LoadingError({endpointName: this.stateName, message: `${response.status}`})
    }
    try {
      const json = await response.json()
      const fetchedData = this.mapResponse(json, params)
      return new Payload(false, formattedUrl, fetchedData, null)
    } catch (e) {
      throw (e instanceof MappingError) ? e : new MappingError(this.stateName, e.message)
    }
  }

  * fetch (action: ActionType<P>): Saga<void> {
    try {
      const payload = yield call(this._loadData.bind(this), action.params)
      yield put({type: `${this.stateName}_FETCH_SUCCEEDED`, payload: payload})
    } catch (e) {
      yield put({type: `${this.stateName}_FETCH_FAILED`, message: e.message})
    }
  }

  * fetchSaga (): Saga<void> {
    yield takeLatest(`FETCH_${this.stateName}_REQUEST`, this.fetch.bind(this))
  }

  * saga (): Generator<*, *, *> {
    yield all([
      fork(this.fetchSaga.bind(this)),
      fork(networkEventsListenerSaga, {
      })
    ])
  }
}

export default Endpoint
