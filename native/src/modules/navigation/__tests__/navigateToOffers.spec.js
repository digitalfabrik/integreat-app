// @flow

import createNavigationScreenPropMock from '../../../testing/createNavigationPropMock'
import navigateToOffers from '../navigateToOffers'
import { OFFERS_ROUTE } from 'api-client/src/routes'

const cityContentUrl = ({ cityCode, languageCode, route }) => `/${cityCode}/${languageCode}/${route}`
jest.mock('../url', () => ({
  cityContentUrl: jest.fn(cityContentUrl)
}))

const cityCode = 'augsburg'
const languageCode = 'de'

describe('createNavigateToOffers', () => {
  it('should navigate to the Offers route with correct parameters', () => {
    const dispatch = jest.fn()
    const navigation = createNavigationScreenPropMock()

    navigateToOffers({ dispatch, navigation, cityCode, languageCode })
    expect(navigation.navigate).toHaveBeenCalledWith({
      name: OFFERS_ROUTE,
      params: {
        cityCode,
        languageCode
      }
    })
  })
})
