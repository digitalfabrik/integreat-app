import { LOCAL_NEWS_TYPE } from 'api-client/src/routes'

import createNavigationScreenPropMock from '../../testing/createNavigationPropMock'
import navigateToNews from '../navigateToNews'

describe('navigateToNews', () => {
  it('should call navigate', () => {
    const navigation = createNavigationScreenPropMock()
    navigateToNews({
      navigation,
      cityCode: 'augsburg',
      languageCode: 'de',
      newsId: null,
      type: LOCAL_NEWS_TYPE,
    })
    expect(navigation.navigate).toHaveBeenCalledWith({
      name: 'news',
      params: { cityCode: 'augsburg', languageCode: 'de', newsId: null, newsType: 'local' },
    })
  })
})
