// @flow

import createNavigationScreenPropMock from '../../../testing/createNavigationPropMock'
import navigateToLanguageChange from '../navigateToLanguageChange'
import LanguageModelBuilder from 'api-client/src/testing/LanguageModelBuilder'
import { generateKey } from '../../app/generateRouteKey'
import sendTrackingSignal from '../../endpoint/sendTrackingSignal'
import { CHANGE_LANGUAGE_MODAL_ROUTE, OPEN_PAGE_SIGNAL_NAME } from 'api-client'

jest.mock('../../endpoint/sendTrackingSignal')
jest.mock('../../i18n/NativeLanguageDetector')

describe('navigateToLanguageChange', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const languages = new LanguageModelBuilder(3).build()
  const availableLanguages = ['de', 'en']
  const previousKey = generateKey()
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
      previousKey
    })
    expect(navigation.navigate).toHaveBeenCalledWith({
      name: CHANGE_LANGUAGE_MODAL_ROUTE,
      params: {
        cityCode,
        currentLanguage: languageCode,
        languages,
        availableLanguages,
        previousKey
      }
    })

    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: {
        name: OPEN_PAGE_SIGNAL_NAME,
        pageType: CHANGE_LANGUAGE_MODAL_ROUTE,
        url: ''
      }
    })
    expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
  })
})
