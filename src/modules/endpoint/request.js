// @flow

import { Payload, Endpoint, MappingError, LoadingError } from '@integreat-app/integreat-api-client'

const request = async function <T, P> (endpoint: Endpoint<P, T>, params: P, overrideUrl?: string): Promise<Payload<T>> {
  const url = overrideUrl || endpoint.mapParamsToUrl('https://cms-test.integreat-app.de', params)
  const response = await (endpoint.mapParamsToBody ? endpoint.postFormData(url, params) : fetch(url))

  if (!response.ok) {
    throw new LoadingError({endpointName: endpoint.stateName, message: `${response.status}`})
  }

  try {
    const json = await response.json()
    const fetchedData = endpoint.mapResponse(json, params)
    return new Payload(false, url, fetchedData, null)
  } catch (e) {
    throw (e instanceof MappingError) ? e : new MappingError(endpoint.stateName, e.message)
  }
}

export default request
