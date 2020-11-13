// @flow

import type { Dispatch } from 'redux'
import { Endpoint, Payload } from 'api-client'
import startFetchAction from './actions/startFetchAction'
import finishFetchAction from './actions/finishFetchAction'
import type { StoreActionType } from './StoreActionType'
import type { PayloadDataType } from './PayloadDataType'

async function fetchData<P, T: PayloadDataType> (
  endpoint: Endpoint<P, T>,
  dispatch: Dispatch<StoreActionType>,
  oldPayload: Payload<T>,
  params: P
): Promise<Payload<T>> {
  let formattedUrl
  try {
    formattedUrl = endpoint.mapParamsToUrl(params)

    const lastUrl = oldPayload.requestUrl

    if (lastUrl && lastUrl === formattedUrl) {
      // The correct data was already fetched
      return oldPayload
    }

    // Fetch if the data is not valid anymore or it hasn't been fetched yet
    dispatch(startFetchAction(endpoint.stateName, formattedUrl, params))

    const payload = await endpoint.request(params)
    dispatch(finishFetchAction(endpoint.stateName, payload, params))
    return payload
  } catch (error) {
    console.error(error)
    const payload = new Payload(false, formattedUrl, null, error)
    dispatch(finishFetchAction(endpoint.stateName, payload, params))
    return payload
  }
}

export default fetchData
