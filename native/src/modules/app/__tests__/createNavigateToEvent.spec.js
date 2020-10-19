// @flow

import createNavigationScreenPropMock from '../../../testing/createNavigationStackPropMock'
import createNavigateToEvent from '../createNavigateToEvent'

describe('createNavigateToEvent', () => {
  it('should generate key if not supplied with at least 6 chars and use it for both navigation and redux actions', () => {
    const dispatch = jest.fn()
    const navigation = createNavigationScreenPropMock()

    const navigateToEvent = createNavigateToEvent(dispatch, navigation)
    navigateToEvent({ cityCode: 'augsburg', language: 'de', path: '/augsburg/de/events/integrationskurs' })

    expect(navigation.navigate).toHaveBeenCalledWith(expect.objectContaining({
      key: expect.stringMatching(/^.{6,}$/) // at least 6 chars but no newline
    }))
    const key = (navigation.navigate: any).mock.calls[0][0].key
    expect(dispatch).toHaveBeenCalledWith({
      type: 'FETCH_EVENT',
      params: expect.objectContaining({ key })
    })
  })

  it('should have onRouteClose in navigation params', () => {
    const dispatch = jest.fn()
    const navigation = createNavigationScreenPropMock()

    const navigateToEvent = createNavigateToEvent(dispatch, navigation)
    navigateToEvent({ cityCode: 'augsburg', language: 'de', path: '/augsburg/de/events/integrationskurs' })

    expect(navigation.navigate).toHaveBeenCalledWith(expect.objectContaining({
      key: expect.any(String), // at least 6 chars but no newline
      params: expect.objectContaining({
        onRouteClose: expect.any(Function)
      })
    }))

    const key = (navigation.navigate: any).mock.calls[0][0].key
    // $FlowFixMe .mock is missing
    navigation.navigate.mock.calls[0][0].params.onRouteClose()
    expect(dispatch).toHaveBeenLastCalledWith({
      type: 'CLEAR_EVENT', params: { key }
    })
  })

  it('should pass path, or the events path if not supplied, as sharePath in navigation params', () => {
    const dispatch = jest.fn()
    const navigation = createNavigationScreenPropMock()
    const navigateToEvent = createNavigateToEvent(dispatch, navigation)

    navigateToEvent({ cityCode: 'augsburg', language: 'de', path: '/augsburg/de/events/integrationskurs' })
    expect(navigation.navigate).toHaveBeenCalledWith(expect.objectContaining({
      params: expect.objectContaining({ sharePath: '/augsburg/de/events/integrationskurs' })
    }))

    navigateToEvent({ cityCode: 'augsburg', language: 'de', path: null })
    expect(navigation.navigate).toHaveBeenCalledWith(expect.objectContaining({
      params: expect.objectContaining({ sharePath: '/augsburg/de/events' })
    }))
  })

  it('should dispatch a FETCH_EVENT action and refresh resources on force refresh', () => {
    const dispatch = jest.fn()
    const navigation = createNavigationScreenPropMock()

    const navigateToEvent = createNavigateToEvent(dispatch, navigation)
    navigateToEvent({
      cityCode: 'augsburg', language: 'de', path: '/augsburg/de/events', key: 'route-id-1', forceRefresh: true
    })

    expect(dispatch).toHaveBeenCalledWith({
      type: 'FETCH_EVENT',
      params: {
        city: 'augsburg',
        language: 'de',
        path: '/augsburg/de/events',
        key: 'route-id-1',
        criterion: { forceUpdate: true, shouldRefreshResources: true }
      }
    })
  })
})
