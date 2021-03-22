// @flow

import EndpointBuilder from '../EndpointBuilder'
import Endpoint from '../Endpoint'
import type { SignalType } from '../tracking'

export const TRACKING_ENDPOINT_NAME = 'tracking'
export const JPAL_TRACKING_ENDPOINT_URL = 'https://jpal.tuerantuer.org/'

export default (url: string = JPAL_TRACKING_ENDPOINT_URL): Endpoint<SignalType, void> =>
  new EndpointBuilder(TRACKING_ENDPOINT_NAME)
    .withParamsToUrlMapper(() => url)
    .withParamsToBodyMapper((signal: SignalType): string => {
      const mappedSignal = {
        name: signal.name,
        page_type: signal.pageType || undefined,
        url: signal.url || undefined,
        query: signal.query || undefined,
        feedback: signal.feedback || undefined, // TODO IGAPP-xxx: Implement feedback signal
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
      return JSON.stringify(mappedSignal)
    })
    .withMapper(() => {})
    .build()
