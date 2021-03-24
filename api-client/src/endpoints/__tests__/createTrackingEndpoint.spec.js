// @flow

import createTrackingEndpoint, { JPAL_TRACKING_ENDPOINT_URL } from '../createTrackingEndpoint'
import { OPEN_PAGE_SIGNAL_NAME } from '../../tracking'
import { DASHBOARD_ROUTE } from '../../routes'

describe('createTrackingEndpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const signal = {
    name: OPEN_PAGE_SIGNAL_NAME,
    pageType: DASHBOARD_ROUTE,
    url: 'https://example.com',
    trackingCode: 'abcdef123456',
    offline: true,
    currentCity: 'muenchen',
    currentLanguage: 'ar',
    systemLanguage: 'de',
    appSettings: {
      allowPushNotifications: true,
      errorTracking: false,
      proposeNearbyCities: false
    },
    timestamp: '2020-01-20T00:00:00.000Z'
  }

  it('should throw fetch error if fetch fails', async () => {
    // $FlowFixMe fetch is a mock
    fetch.mockRejectOnce(() => Promise.reject(new Error('Das Internet ist kaputt!!!1!!!11elf!')))
    expect.assertions(1)
    return createTrackingEndpoint()
      .request(signal)
      .catch(e =>
        expect(e.message).toContain(
          'FetchError: Failed to load the request for the tracking endpoint. Das Internet ist kaputt!!!1!!!11elf!'
        )
      )
  })

  it('should throw response error if response is not ok', async () => {
    // $FlowFixMe fetch is a mock
    fetch.mockResponseOnce('Invalid endpoint', {
      ok: false,
      status: 500,
      statusText: ' not ok'
    })
    expect.assertions(1)
    return createTrackingEndpoint()
      .request(signal)
      .catch(e =>
        expect(e.message).toContain('ResponseError: Failed to POST the request for the tracking endpoint with the url')
      )
  })

  it('should call the endpoint correctly', async () => {
    await createTrackingEndpoint().request(signal)
    expect(fetch).toHaveBeenCalledWith(
      JPAL_TRACKING_ENDPOINT_URL,
      expect.objectContaining({
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST'
      })
    )
  })

  it('should use passed endpoint url', async () => {
    await createTrackingEndpoint('https://example.com').request(signal)
    expect(fetch).toHaveBeenCalledWith('https://example.com', expect.any(Object))
  })

  it('should correctly map signal to body', async () => {
    const remainingProps = { query: 'some query', feedback: {}, fromUrl: 'https://example.com/another/example' }
    // $FlowFixMe Test all possible properties
    await createTrackingEndpoint().request({ ...signal, ...remainingProps })
    expect(fetch).toHaveBeenCalledWith(
      JPAL_TRACKING_ENDPOINT_URL,
      expect.objectContaining({
        body: JSON.stringify({
          name: signal.name,
          tracking_code: signal.trackingCode,
          timestamp: signal.timestamp,
          metadata: {
            page_type: signal.pageType,
            url: signal.url,
            query: 'some query',
            feedback: {},
            from_url: 'https://example.com/another/example',
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
        })
      })
    )
  })
})
