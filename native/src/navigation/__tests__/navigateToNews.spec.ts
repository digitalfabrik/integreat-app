import { LOCAL_NEWS_TYPE } from 'api-client/src/routes'

import createNavigationScreenPropMock from '../../testing/createNavigationPropMock'
import navigateToNews from '../navigateToNews'

describe('navigateToNews', () => {
  it('should generate key if not supplied with at least 6 chars and use it for navigation and redux actions', () => {
    const navigation = createNavigationScreenPropMock()
    navigateToNews({
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
  })
})
