import createNavigationScreenPropMock from '../../../testing/createNavigationPropMock'
import navigateToNews from '../navigateToNews'
import { LOCAL_NEWS_TYPE } from 'api-client/src/routes'
describe('navigateToNews', () => {
  it('should generate key if not supplied with at least 6 chars and use it for navigation and redux actions', () => {
    const dispatch = jest.fn()
    const navigation = createNavigationScreenPropMock()
    navigateToNews({
      dispatch,
      navigation,
      cityCode: 'augsburg',
      languageCode: 'de',
      newsId: null,
      type: LOCAL_NEWS_TYPE
    })
    expect(navigation.navigate).toHaveBeenCalledWith(
      expect.objectContaining({
        key: expect.stringMatching(/^.{6,}$/) // at least 6 chars but no newline
      })
    )
    const key = (navigation.navigate as any).mock.calls[0][0].key
    expect(dispatch).toHaveBeenCalledWith({
      type: 'FETCH_NEWS',
      params: expect.objectContaining({
        key
      })
    })
  })
  it('should dispatch a FETCH_NEWS action and refresh resources on force refresh', () => {
    const dispatch = jest.fn()
    const navigation = createNavigationScreenPropMock()
    navigateToNews({
      dispatch,
      navigation,
      cityCode: 'augsburg',
      type: LOCAL_NEWS_TYPE,
      languageCode: 'de',
      newsId: '12',
      key: 'route-id-1',
      forceRefresh: true
    })
    expect(dispatch).toHaveBeenCalledWith({
      type: 'FETCH_NEWS',
      params: {
        city: 'augsburg',
        language: 'de',
        newsId: '12',
        key: 'route-id-1',
        type: LOCAL_NEWS_TYPE,
        criterion: {
          forceUpdate: true,
          shouldRefreshResources: true
        }
      }
    })
  })
})
