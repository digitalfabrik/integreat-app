// @flow

import type { SignalType } from '../tracking'
import type { RequestOptionsType } from '../errors/ResponseError'
import ResponseError from '../errors/ResponseError'
import FetchError from '../errors/FetchError'

export const TRACKING_ENDPOINT_NAME = 'tracking'
export const JPAL_TRACKING_ENDPOINT_URL = 'https://jpal.tuerantuer.org/'

const JSON_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
}

const createTrackingEndpoint = (url: string = JPAL_TRACKING_ENDPOINT_URL) => {
  const request = async (signal: SignalType) => {
    const mappedSignal = {
      name: signal.name,
      page_type: signal.pageType || undefined,
      url: signal.url || undefined,
      query: signal.query || undefined,
      feedback: signal.feedback || undefined, // TODO IGAPP-564: Implement feedback signal
      from_url: signal.fromUrl || undefined,
      tracking_code: signal.trackingCode,
      metadata: {
        offline: signal.metadata.offline,
        system_language: signal.metadata.systemLanguage,
        current_language: signal.metadata.currentLanguage,
        current_city: signal.metadata.currentCity,
        app_settings: {
          error_tracking: signal.metadata.appSettings.errorTracking,
          allow_push_notifications: signal.metadata.appSettings.allowPushNotifications,
          propose_nearby_cities: signal.metadata.appSettings.proposeNearbyCities
        },
        timestamp: signal.metadata.timestamp
      }
    }
    const body = JSON.stringify(mappedSignal)
    const requestOptions: RequestOptionsType = {
      method: 'POST',
      body: body,
      headers: JSON_HEADERS
    }
    const response = await fetch(url, requestOptions).catch((e: Error) => {
      throw new FetchError({ endpointName: TRACKING_ENDPOINT_NAME, innerError: e })
    })

    if (!response.ok) {
      throw new ResponseError({ endpointName: TRACKING_ENDPOINT_NAME, response, url, requestOptions })
    }
  }

  return { request }
}

export default createTrackingEndpoint
