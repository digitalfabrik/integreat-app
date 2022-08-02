import { SPRUNGBRETT_OFFER_ROUTE } from 'api-client/src/routes'

import createNavigationScreenPropMock from '../../testing/createNavigationPropMock'
import navigateToSprungbrettOffer from '../navigateToSprungbrettOffer'

const cityCode = 'augsburg'
const languageCode = 'de'
describe('navigateToSprungbrettOffer', () => {
  it('should navigate to the sprungbrett offer route with correct parameters', () => {
    const dispatch = jest.fn()
    const navigation = createNavigationScreenPropMock()
    navigateToSprungbrettOffer({
      dispatch,
      navigation,
      cityCode,
      languageCode,
    })
    expect(navigation.navigate).toHaveBeenCalledWith({
      name: SPRUNGBRETT_OFFER_ROUTE,
      params: {
        cityCode,
        languageCode,
      },
    })
  })
})
