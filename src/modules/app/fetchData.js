// @flow

import type { Dispatch } from 'redux-first-router/dist/flow-types'
import { Payload, LoadingError, ParamMissingError, MappingError, Endpoint } from '@integreat-app/integreat-api-client'
import startFetchAction from './actions/startFetchAction'
import finishFetchAction from './actions/finishFetchAction'

async function fetchData<P, T> (
  endpoint: Endpoint<P, T>,
  dispatch: Dispatch, oldPayload: Payload<T>,
  params: P
): Promise<Payload<T>> {
  let formattedUrl
  try {
    const responseOverride = endpoint.responseOverride
    const errorOverride = endpoint.errorOverride

    formattedUrl = endpoint.mapParamsToUrl(params)

    const lastUrl = oldPayload.requestUrl

    if (lastUrl && lastUrl === formattedUrl) {
      // The correct data was already fetched
      return oldPayload
    }

    // Fetch if the data is not valid anymore or it hasn't been fetched yet
    dispatch(startFetchAction(endpoint.stateName, formattedUrl))

    if (errorOverride) {
      const payload = new Payload(false, formattedUrl, null, errorOverride)
      dispatch(finishFetchAction(endpoint.stateName, payload))
      return payload
    }
    if (responseOverride) {
      const data = endpoint.mapResponse(responseOverride, params)
      const payload = new Payload(false, formattedUrl, data, null)
      dispatch(finishFetchAction(endpoint.stateName, payload))
      return payload
    }

    const payload = await endpoint.request(params, formattedUrl)
    dispatch(finishFetchAction(endpoint.stateName, payload))
    return payload
  } catch (e) {
    let error
    if (e instanceof LoadingError || e instanceof ParamMissingError || e instanceof MappingError) {
      error = e
    } else {
      error = new LoadingError({endpointName: endpoint.stateName, message: e.message})
    }

    console.error(error)
    const payload = new Payload(false, formattedUrl, null, error)
    dispatch(finishFetchAction(endpoint.stateName, payload))
    return payload
  }
}

export default fetchData
