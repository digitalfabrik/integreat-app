import FetchError from '../errors/FetchError'
import ResponseError from '../errors/ResponseError'
import { request as fetch } from '../request'
import {
  CLOSE_PAGE_SIGNAL_NAME,
  OPEN_PAGE_SIGNAL_NAME,
  RESUME_SIGNAL_NAME,
  SEARCH_FINISHED_SIGNAL_NAME,
  SEND_FEEDBACK_SIGNAL_NAME,
  SignalType,
  SUSPEND_SIGNAL_NAME,
} from '../tracking'

export const TRACKING_ENDPOINT_NAME = 'tracking'
export const JPAL_TRACKING_ENDPOINT_URL = 'https://jpal.tuerantuer.org/'
const JSON_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

type TrackingEndpointType = {
  request: (signal: SignalType) => Promise<void>
}

const createTrackingEndpoint = (url: string = JPAL_TRACKING_ENDPOINT_URL): TrackingEndpointType => {
  const request = async (signal: SignalType) => {
    const pageType = signal.name === OPEN_PAGE_SIGNAL_NAME ? signal.pageType : undefined
    const signalUrl =
      signal.name !== SEND_FEEDBACK_SIGNAL_NAME &&
      signal.name !== RESUME_SIGNAL_NAME &&
      signal.name !== SUSPEND_SIGNAL_NAME &&
      signal.name !== CLOSE_PAGE_SIGNAL_NAME
        ? signal.url
        : undefined
    const query = signal.name === SEARCH_FINISHED_SIGNAL_NAME ? signal.query : undefined
    const feedback = signal.name === SEND_FEEDBACK_SIGNAL_NAME ? signal.feedback : undefined

    const mappedSignal = {
      name: signal.name,
      tracking_code: signal.trackingCode,
      timestamp: signal.timestamp,
      metadata: {
        page_type: pageType,
        url: signalUrl,
        query,
        feedback,
        offline: signal.offline,
        system_language: signal.systemLanguage,
        current_language: signal.currentLanguage,
        current_city: signal.currentCity,
        app_settings: {
          error_tracking: signal.appSettings.errorTracking,
          allow_push_notifications: signal.appSettings.allowPushNotifications,
        },
      },
    }
    const body = JSON.stringify(mappedSignal)
    const requestOptions = {
      method: 'POST',
      body,
      headers: JSON_HEADERS,
    }
    const response = await fetch(url, requestOptions).catch((e: Error) => {
      throw new FetchError({
        endpointName: TRACKING_ENDPOINT_NAME,
        innerError: e,
        requestOptions,
        url,
      })
    })

    if (!response.ok) {
      throw new ResponseError({
        endpointName: TRACKING_ENDPOINT_NAME,
        response: response as Response,
        url,
        requestOptions: {
          method: 'POST',
          body,
        },
      })
    }
  }

  return {
    request,
  }
}

export default createTrackingEndpoint
