import { mocked } from 'ts-jest/utils'

import createNavigationScreenPropMock from '../../testing/createNavigationPropMock'
import navigateToEvents from '../navigateToEvents'

const url = (path: string) => `some.base.url/${path}`

jest.mock('../url', () => ({
  url: jest.fn(url)
}))
const cityCode = 'augsburg'
const languageCode = 'de'
const cityContentPath = '/augsburg/de/integrationskurs'
describe('navigateToEvents', () => {
  it('should generate key if not supplied with at least 6 chars and use it for both navigation and redux actions', () => {
    const dispatch = jest.fn()
    const navigation = createNavigationScreenPropMock()
    navigateToEvents({
      dispatch,
      navigation,
      cityCode,
      languageCode,
      cityContentPath
    })
    expect(navigation.navigate).toHaveBeenCalledWith(
      expect.objectContaining({
        key: expect.stringMatching(/^.{6,}$/) // at least 6 chars but no newline
      })
    )
    const { key } = mocked(navigation.navigate).mock.calls[0][0]
    expect(dispatch).toHaveBeenCalledWith({
      type: 'FETCH_EVENT',
      params: expect.objectContaining({
        key
      })
    })
  })
  it('should dispatch a FETCH_EVENT action and refresh resources on force refresh', () => {
    const dispatch = jest.fn()
    const navigation = createNavigationScreenPropMock()
    navigateToEvents({
      dispatch,
      navigation,
      cityCode: 'augsburg',
      languageCode: 'de',
      cityContentPath: '/augsburg/de/events',
      key: 'route-id-1',
      forceRefresh: true
    })
    expect(dispatch).toHaveBeenCalledWith({
      type: 'FETCH_EVENT',
      params: {
        city: 'augsburg',
        language: 'de',
        path: '/augsburg/de/events',
        key: 'route-id-1',
        criterion: {
          forceUpdate: true,
          shouldRefreshResources: true
        }
      }
    })
  })
})
