import { OFFERS_ROUTE } from 'api-client/src/routes'

import createNavigationScreenPropMock from '../../testing/createNavigationPropMock'
import navigateToOffers from '../navigateToOffers'

const cityCode = 'augsburg'
const languageCode = 'de'
describe('navigateToOffers', () => {
  it('should navigate to the Offers route with correct parameters', () => {
    const navigation = createNavigationScreenPropMock()
    navigateToOffers({
      navigation,
      cityCode,
      languageCode,
    })
    expect(navigation.navigate).toHaveBeenCalledWith({
      name: OFFERS_ROUTE,
      params: {
        cityCode,
        languageCode,
      },
    })
  })
})
