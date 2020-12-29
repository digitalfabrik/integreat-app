// @flow

import createNavigationScreenPropMock from '../../../testing/createNavigationPropMock'
import createNavigateToOffers from '../createNavigateToOffers'
import { OFFERS_ROUTE } from '../components/NavigationTypes'

const cityContentUrl = ({ cityCode, languageCode, route }) => `/${cityCode}/${languageCode}/${route}`
jest.mock('../../common/url', () => ({
  cityContentUrl: jest.fn(cityContentUrl)
}))

const cityCode = 'augsburg'
const language = 'de'

describe('createNavigateToOffers', () => {
  it('should navigate to the Offers route with correct parameters', () => {
    const dispatch = jest.fn()
    const navigation = createNavigationScreenPropMock()

    const navigateToOffers = createNavigateToOffers(dispatch, navigation)
    navigateToOffers({ cityCode, language })
    expect(navigation.navigate).toHaveBeenCalledWith({
      name: OFFERS_ROUTE,
      params: {
        shareUrl: cityContentUrl({ cityCode, languageCode: language, route: OFFERS_ROUTE }),
        cityCode
      }
    })
  })
})
