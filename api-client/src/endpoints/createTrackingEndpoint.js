// @flow

import type { SignalType } from '../tracking'
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
      tracking_code: signal.trackingCode,
      timestamp: signal.timestamp,
      metadata: {
        page_type: signal.pageType || undefined,
        url: signal.url || undefined,
        query: signal.query || undefined,
        feedback: signal.feedback || undefined, // TODO IGAPP-564: Implement feedback signal
        from_url: signal.fromUrl || undefined,
        offline: signal.offline,
        system_language: signal.systemLanguage,
        current_language: signal.currentLanguage,
        current_city: signal.currentCity,
        app_settings: {
          error_tracking: signal.appSettings.errorTracking,
          allow_push_notifications: signal.appSettings.allowPushNotifications,
          propose_nearby_cities: signal.appSettings.proposeNearbyCities
        }
      }
    }
    const body = JSON.stringify(mappedSignal)
    const response = await fetch(url, {
      method: 'POST',
      body: body,
      headers: JSON_HEADERS
    }).catch((e: Error) => {
      throw new FetchError({ endpointName: TRACKING_ENDPOINT_NAME, innerError: e })
    })

    if (!response.ok) {
      throw new ResponseError({
        endpointName: TRACKING_ENDPOINT_NAME,
        response,
        url,
        requestOptions: {
          method: 'POST',
          body: body,
          headers: JSON_HEADERS
        }
      })
    }
  }

  return { request }
}

export default createTrackingEndpoint
