// @flow

import type { Dispatch } from 'redux-first-router'
import Payload from '../endpoint/Payload'
import startFetchAction from './actions/startFetchAction'
import finishFetchAction from './actions/finishFetchAction'
import LoadingError from '../endpoint/errors/LoadingError'
import ParamMissingError from '../endpoint/errors/ParamMissingError'
import MappingError from '../endpoint/errors/MappingError'
import Endpoint from '../endpoint/Endpoint'

async function fetchData<P, T> (
  endpoint: Endpoint<P, T>,
  dispatch: Dispatch, oldPayload: Payload<T>,
  params: P
): Promise<Payload<T>> {
  let formattedUrl
  try {
    const responseOverride = endpoint.responseOverride
    const errorOverride = endpoint.errorOverride

    formattedUrl = this.mapParamsToUrl(params)

    const lastUrl = oldPayload.requestUrl

    if (lastUrl && lastUrl === formattedUrl) {
      // The correct data was already fetched
      return oldPayload
    }

    // Fetch if the data is not valid anymore or it hasn't been fetched yet
    dispatch(startFetchAction(this.stateName, formattedUrl))

    if (errorOverride) {
      const payload = new Payload(false, formattedUrl, null, errorOverride)
      dispatch(finishFetchAction(this.stateName, payload))
      return payload
    }
    if (responseOverride) {
      const data = this.mapResponse(responseOverride, params)
      const payload = new Payload(false, formattedUrl, data, null)
      dispatch(finishFetchAction(this.stateName, payload))
      return payload
    }

    const payload = await this.fetchData(formattedUrl, params)
    dispatch(finishFetchAction(this.stateName, payload))
    return payload
  } catch (e) {
    let error
    if (e instanceof LoadingError || e instanceof ParamMissingError || e instanceof MappingError) {
      error = e
    } else {
      error = new LoadingError({endpointName: this.stateName, message: e.message})
    }

    console.error(error)
    const payload = new Payload(false, formattedUrl, null, error)
    dispatch(finishFetchAction(this.stateName, payload))
    return payload
  }
}

export default fetchData
