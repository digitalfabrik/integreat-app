// @flow

import type { Dispatch } from 'redux'
import { Endpoint, Payload } from '@integreat-app/integreat-api-client'
import startFetchMoreAction from '../../modules/app/actions/startFetchMoreAction'
import finishFetchMoreAction from '../../modules/app/actions/finishFetchMoreAction'
import type { StoreActionType } from './StoreActionType'
import type { PayloadDataType } from './PayloadDataType'

async function fetchMoreData<P, T: PayloadDataType> (
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
    dispatch(startFetchMoreAction(endpoint.stateName, formattedUrl))

    const payload = await endpoint.request(params)
    dispatch(finishFetchMoreAction(endpoint.stateName, payload))
    return payload
  } catch (error) {
    console.error(error)
    const payload = new Payload(false, formattedUrl, null, error)
    dispatch(finishFetchMoreAction(endpoint.stateName, payload))
    return payload
  }
}

export default fetchMoreData
