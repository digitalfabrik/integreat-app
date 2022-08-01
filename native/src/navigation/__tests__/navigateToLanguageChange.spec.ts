import { CHANGE_LANGUAGE_MODAL_ROUTE, OPEN_PAGE_SIGNAL_NAME } from 'api-client'
import LanguageModelBuilder from 'api-client/src/testing/LanguageModelBuilder'

import createNavigationScreenPropMock from '../../testing/createNavigationPropMock'
import { generateRouteKey } from '../../utils/helpers'
import sendTrackingSignal from '../../utils/sendTrackingSignal'
import navigateToLanguageChange from '../navigateToLanguageChange'

jest.mock('../../utils/sendTrackingSignal')

describe('navigateToLanguageChange', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  const languages = new LanguageModelBuilder(3).build()
  const availableLanguages = ['de', 'en']
  const previousKey = generateRouteKey()
  const cityCode = 'augsburg'
  const languageCode = 'de'
  it('should navigate to language change and send a tracking signal', () => {
    const navigation = createNavigationScreenPropMock()
    navigateToLanguageChange({
      navigation,
      cityCode,
      languageCode,
      languages,
      availableLanguages,
      previousKey,
    })
    expect(navigation.navigate).toHaveBeenCalledWith({
      name: CHANGE_LANGUAGE_MODAL_ROUTE,
      params: {
        cityCode,
        currentLanguage: languageCode,
        languages,
        availableLanguages,
        previousKey,
      },
    })
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: {
        name: OPEN_PAGE_SIGNAL_NAME,
        pageType: CHANGE_LANGUAGE_MODAL_ROUTE,
        url: '',
      },
    })
    expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
  })
})
