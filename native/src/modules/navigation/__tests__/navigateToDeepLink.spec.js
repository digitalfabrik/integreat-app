// @flow

import buildConfig from '../../app/constants/buildConfig'
import createNavigationPropMock from '../../../testing/createNavigationPropMock'
import navigateToDeepLink from '../navigateToDeepLink'
import {
  DASHBOARD_ROUTE,
  EVENTS_ROUTE,
  INTRO_ROUTE,
  JPAL_TRACKING_ROUTE,
  LANDING_ROUTE,
  LOCAL_NEWS_TYPE,
  NEWS_ROUTE,
  OFFERS_ROUTE,
  OPEN_DEEP_LINK_SIGNAL_NAME
} from 'api-client'
import AppSettings from '../../settings/AppSettings'
import createNavigate from '../createNavigate'
import navigateToCategory from '../navigateToCategory'
import sendTrackingSignal from '../../endpoint/sendTrackingSignal'

let navigateTo
jest.mock('../createNavigate', () => {
  const mockFunction = jest.fn()
  navigateTo = mockFunction
  return jest.fn(() => mockFunction)
})
jest.mock('../navigateToCategory')
jest.mock('../../endpoint/sendTrackingSignal')
jest.mock('../../i18n/NativeLanguageDetector')

describe('navigateToDeepLink', () => {
  const dispatch = jest.fn()
  const navigation = createNavigationPropMock()
  const language = 'kmr'
  const appSettings = new AppSettings()

  beforeEach(async () => {
    jest.clearAllMocks()
    await appSettings.clearAppSettings()
  })

  describe('landing deep links', () => {
    const url = 'https://integreat.app'

    it('should navigate to the into slides if not shown yet and enabled in the build config', async () => {
      // $FlowFixMe build config is a mock
      buildConfig.mockImplementationOnce(() => ({ featureFlags: { introSlides: true } }))
      await appSettings.setContentLanguage(language)

      await navigateToDeepLink(dispatch, navigation, url, language)

      expect(navigation.replace).toHaveBeenCalledTimes(1)
      expect(navigation.replace).toHaveBeenCalledWith(INTRO_ROUTE, { deepLink: url })
      expect(createNavigate).not.toHaveBeenCalled()
      expect(navigateToCategory).not.toHaveBeenCalled()
      expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
      expect(sendTrackingSignal).toHaveBeenCalledWith({ signal: { name: OPEN_DEEP_LINK_SIGNAL_NAME, url } })
    })

    it('should navigate to landing if no city is selected and intro slides already shown', async () => {
      // $FlowFixMe build config is a mock
      buildConfig.mockImplementationOnce(() => ({ featureFlags: { introSlides: true } }))
      await appSettings.setContentLanguage(language)
      await appSettings.setIntroShown()

      await navigateToDeepLink(dispatch, navigation, url, language)

      expect(navigation.replace).toHaveBeenCalledTimes(1)
      expect(navigation.replace).toHaveBeenCalledWith(LANDING_ROUTE)
      expect(createNavigate).not.toHaveBeenCalled()
      expect(navigateToCategory).not.toHaveBeenCalled()
      expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
      expect(sendTrackingSignal).toHaveBeenCalledWith({ signal: { name: OPEN_DEEP_LINK_SIGNAL_NAME, url } })
    })

    it('should navigate to landing if no city is selected and intro slides disabled', async () => {
      // $FlowFixMe build config is a mock
      buildConfig.mockImplementationOnce(() => ({ featureFlags: { introSlides: false } }))
      await appSettings.setContentLanguage(language)

      await navigateToDeepLink(dispatch, navigation, url, language)

      expect(navigation.replace).toHaveBeenCalledTimes(1)
      expect(navigation.replace).toHaveBeenCalledWith(LANDING_ROUTE)
      expect(createNavigate).not.toHaveBeenCalled()
      expect(navigateToCategory).not.toHaveBeenCalled()
      expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
      expect(sendTrackingSignal).toHaveBeenCalledWith({ signal: { name: OPEN_DEEP_LINK_SIGNAL_NAME, url } })
    })

    it('should navigate to dashboard if there is a fixed city and intro slides already shown', async () => {
      const fixedCity = 'aschaffenburg'
      // $FlowFixMe build config is a mock
      buildConfig.mockImplementationOnce(() => ({ featureFlags: { introSlides: true, fixedCity } }))
      await appSettings.setContentLanguage(language)
      await appSettings.setIntroShown()

      await navigateToDeepLink(dispatch, navigation, url, language)

      expect(navigateToCategory).toHaveBeenCalledTimes(1)
      expect(navigateToCategory).toHaveBeenCalledWith({
        dispatch,
        navigation,
        cityCode: fixedCity,
        languageCode: language,
        routeName: DASHBOARD_ROUTE,
        cityContentPath: `/${fixedCity}/${language}`,
        forceRefresh: false,
        resetNavigation: true
      })
      expect(navigation.replace).not.toHaveBeenCalled()
      expect(createNavigate).not.toHaveBeenCalled()
      expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
      expect(sendTrackingSignal).toHaveBeenCalledWith({ signal: { name: OPEN_DEEP_LINK_SIGNAL_NAME, url } })
    })

    it('should navigate to dashboard if there is already a selected city', async () => {
      const selectedCity = 'nuernberg'
      // $FlowFixMe build config is a mock
      buildConfig.mockImplementationOnce(() => ({ featureFlags: { introSlides: false } }))
      await appSettings.setContentLanguage(language)
      await appSettings.setSelectedCity(selectedCity)

      await navigateToDeepLink(dispatch, navigation, url, language)

      expect(navigateToCategory).toHaveBeenCalledTimes(1)
      expect(navigateToCategory).toHaveBeenCalledWith({
        dispatch,
        navigation,
        cityCode: selectedCity,
        languageCode: language,
        routeName: DASHBOARD_ROUTE,
        cityContentPath: `/${selectedCity}/${language}`,
        forceRefresh: false,
        resetNavigation: true
      })
      expect(navigation.replace).not.toHaveBeenCalled()
      expect(createNavigate).not.toHaveBeenCalled()
      expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
      expect(sendTrackingSignal).toHaveBeenCalledWith({ signal: { name: OPEN_DEEP_LINK_SIGNAL_NAME, url } })
    })
  })

  describe('dashboard deep links', () => {
    const cityCode = `muenchen`
    const languageCode = `ar`
    const url = `https://integreat.app/${cityCode}/${languageCode}`

    it('should navigate to the into slides if not shown yet and enabled in the build config', async () => {
      // $FlowFixMe build config is a mock
      buildConfig.mockImplementationOnce(() => ({ featureFlags: { introSlides: true } }))
      await appSettings.setContentLanguage(language)

      await navigateToDeepLink(dispatch, navigation, url, language)

      expect(navigation.replace).toHaveBeenCalledTimes(1)
      expect(navigation.replace).toHaveBeenCalledWith(INTRO_ROUTE, { deepLink: url })
      expect(createNavigate).not.toHaveBeenCalled()
      expect(navigateToCategory).not.toHaveBeenCalled()
      expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
      expect(sendTrackingSignal).toHaveBeenCalledWith({ signal: { name: OPEN_DEEP_LINK_SIGNAL_NAME, url } })
    })

    it('should navigate to dashboard if intro slides already shown', async () => {
      // $FlowFixMe build config is a mock
      buildConfig.mockImplementationOnce(() => ({ featureFlags: { introSlides: true } }))
      await appSettings.setContentLanguage(language)
      await appSettings.setIntroShown()

      await navigateToDeepLink(dispatch, navigation, url, language)

      expect(navigateToCategory).toHaveBeenCalledTimes(1)
      expect(navigateToCategory).toHaveBeenCalledWith({
        dispatch,
        navigation,
        cityCode,
        languageCode,
        routeName: DASHBOARD_ROUTE,
        cityContentPath: `/${cityCode}/${languageCode}`,
        forceRefresh: false,
        resetNavigation: true
      })
      expect(navigation.replace).not.toHaveBeenCalled()
      expect(createNavigate).not.toHaveBeenCalled()
      expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
      expect(sendTrackingSignal).toHaveBeenCalledWith({ signal: { name: OPEN_DEEP_LINK_SIGNAL_NAME, url } })
    })

    it('should navigate to dashboard and use current language if intro slides already shown', async () => {
      const url = `https://integreat.app/${cityCode}`
      // $FlowFixMe build config is a mock
      buildConfig.mockImplementationOnce(() => ({ featureFlags: { introSlides: true } }))
      await appSettings.setContentLanguage(language)
      await appSettings.setIntroShown()

      await navigateToDeepLink(dispatch, navigation, url, language)

      expect(navigateToCategory).toHaveBeenCalledTimes(1)
      expect(navigateToCategory).toHaveBeenCalledWith({
        dispatch,
        navigation,
        cityCode,
        languageCode: language,
        routeName: DASHBOARD_ROUTE,
        cityContentPath: `/${cityCode}/${language}`,
        forceRefresh: false,
        resetNavigation: true
      })
      expect(navigation.replace).not.toHaveBeenCalled()
      expect(createNavigate).not.toHaveBeenCalled()
      expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
      expect(sendTrackingSignal).toHaveBeenCalledWith({ signal: { name: OPEN_DEEP_LINK_SIGNAL_NAME, url } })
    })

    it('should open selected city dashboard and navigate to route', async () => {
      const selectedCity = 'testumgebung'
      const url = `https://integreat.app/${cityCode}`
      // $FlowFixMe build config is a mock
      buildConfig.mockImplementationOnce(() => ({ featureFlags: { introSlides: true } }))
      await appSettings.setContentLanguage(language)
      await appSettings.setSelectedCity(selectedCity)
      await appSettings.setIntroShown()

      await navigateToDeepLink(dispatch, navigation, url, language)

      expect(navigateToCategory).toHaveBeenCalledTimes(1)
      expect(navigateToCategory).toHaveBeenCalledWith({
        dispatch,
        navigation,
        cityCode: selectedCity,
        languageCode: language,
        routeName: DASHBOARD_ROUTE,
        cityContentPath: `/${selectedCity}/${language}`,
        forceRefresh: false,
        resetNavigation: true
      })
      expect(navigation.replace).not.toHaveBeenCalled()
      expect(createNavigate).toHaveBeenCalledTimes(1)
      expect(createNavigate).toHaveBeenCalledWith(dispatch, navigation)
      expect(navigateTo).toHaveBeenCalledTimes(1)
      expect(navigateTo).toHaveBeenCalledWith(
        {
          cityCode,
          languageCode: language,
          cityContentPath: `/${cityCode}/${language}`,
          route: DASHBOARD_ROUTE
        },
        undefined,
        false
      )
      expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
      expect(sendTrackingSignal).toHaveBeenCalledWith({ signal: { name: OPEN_DEEP_LINK_SIGNAL_NAME, url } })
    })

    it('should navigate to fixed city if intro slides disabled', async () => {
      const fixedCity = 'aschaffenburg'
      // $FlowFixMe build config is a mock
      buildConfig.mockImplementationOnce(() => ({ featureFlags: { introSlides: false, fixedCity } }))
      await appSettings.setContentLanguage(language)

      await navigateToDeepLink(dispatch, navigation, url, language)

      expect(navigateToCategory).toHaveBeenCalledTimes(1)
      expect(navigateToCategory).toHaveBeenCalledWith({
        dispatch,
        navigation,
        cityCode: fixedCity,
        languageCode: language,
        routeName: DASHBOARD_ROUTE,
        cityContentPath: `/${fixedCity}/${language}`,
        forceRefresh: false,
        resetNavigation: true
      })
      expect(navigation.replace).not.toHaveBeenCalled()
      expect(createNavigate).not.toHaveBeenCalled()
      expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
      expect(sendTrackingSignal).toHaveBeenCalledWith({ signal: { name: OPEN_DEEP_LINK_SIGNAL_NAME, url } })
    })
  })

  describe('city content deep links', () => {
    const cityCode = `muenchen`
    const languageCode = `ar`

    it('should navigate to the into slides if not shown yet and enabled in the build config', async () => {
      const url = `https://integreat.app/${cityCode}/${languageCode}/events/some-event`
      // $FlowFixMe build config is a mock
      buildConfig.mockImplementationOnce(() => ({ featureFlags: { introSlides: true } }))
      await appSettings.setContentLanguage(language)

      await navigateToDeepLink(dispatch, navigation, url, language)

      expect(navigation.replace).toHaveBeenCalledTimes(1)
      expect(navigation.replace).toHaveBeenCalledWith(INTRO_ROUTE, { deepLink: url })
      expect(createNavigate).not.toHaveBeenCalled()
      expect(navigateToCategory).not.toHaveBeenCalled()
      expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
      expect(sendTrackingSignal).toHaveBeenCalledWith({ signal: { name: OPEN_DEEP_LINK_SIGNAL_NAME, url } })
    })

    it('should open dashboard and navigate to events route if intro slides already shown', async () => {
      const url = `https://integreat.app/${cityCode}/${languageCode}/events/some-event`
      // $FlowFixMe build config is a mock
      buildConfig.mockImplementationOnce(() => ({ featureFlags: { introSlides: true } }))
      await appSettings.setContentLanguage(language)
      await appSettings.setIntroShown()

      await navigateToDeepLink(dispatch, navigation, url, language)

      expect(navigateToCategory).toHaveBeenCalledTimes(1)
      expect(navigateToCategory).toHaveBeenCalledWith({
        dispatch,
        navigation,
        cityCode,
        languageCode,
        routeName: DASHBOARD_ROUTE,
        cityContentPath: `/${cityCode}/${languageCode}`,
        forceRefresh: false,
        resetNavigation: true
      })
      expect(navigation.replace).not.toHaveBeenCalled()
      expect(createNavigate).toHaveBeenCalledTimes(1)
      expect(createNavigate).toHaveBeenCalledWith(dispatch, navigation)
      expect(navigateTo).toHaveBeenCalledTimes(1)
      expect(navigateTo).toHaveBeenCalledWith(
        {
          cityCode,
          languageCode,
          cityContentPath: `/${cityCode}/${languageCode}/events/some-event`,
          route: EVENTS_ROUTE
        },
        undefined,
        false
      )
      expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
      expect(sendTrackingSignal).toHaveBeenCalledWith({ signal: { name: OPEN_DEEP_LINK_SIGNAL_NAME, url } })
    })

    it('should open dashboard and navigate to offers route if intro slides already shown', async () => {
      const url = `https://integreat.app/${cityCode}/${languageCode}/offers`
      // $FlowFixMe build config is a mock
      buildConfig.mockImplementationOnce(() => ({ featureFlags: { introSlides: true } }))
      await appSettings.setContentLanguage(language)
      await appSettings.setIntroShown()

      await navigateToDeepLink(dispatch, navigation, url, language)

      expect(navigateToCategory).toHaveBeenCalledTimes(1)
      expect(navigateToCategory).toHaveBeenCalledWith({
        dispatch,
        navigation,
        cityCode,
        languageCode,
        routeName: DASHBOARD_ROUTE,
        cityContentPath: `/${cityCode}/${languageCode}`,
        forceRefresh: false,
        resetNavigation: true
      })
      expect(navigation.replace).not.toHaveBeenCalled()
      expect(createNavigate).toHaveBeenCalledTimes(1)
      expect(createNavigate).toHaveBeenCalledWith(dispatch, navigation)
      expect(navigateTo).toHaveBeenCalledTimes(1)
      expect(navigateTo).toHaveBeenCalledWith(
        {
          cityCode,
          languageCode,
          route: OFFERS_ROUTE
        },
        undefined,
        false
      )
      expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
      expect(sendTrackingSignal).toHaveBeenCalledWith({ signal: { name: OPEN_DEEP_LINK_SIGNAL_NAME, url } })
    })

    it('should open selected city dashboard and navigate to route', async () => {
      const selectedCity = 'testumgebung'
      const url = `https://integreat.app/${cityCode}/en/news`
      // $FlowFixMe build config is a mock
      buildConfig.mockImplementationOnce(() => ({ featureFlags: { introSlides: true } }))
      await appSettings.setContentLanguage(language)
      await appSettings.setSelectedCity(selectedCity)
      await appSettings.setIntroShown()

      await navigateToDeepLink(dispatch, navigation, url, language)

      expect(navigateToCategory).toHaveBeenCalledTimes(1)
      expect(navigateToCategory).toHaveBeenCalledWith({
        dispatch,
        navigation,
        cityCode: selectedCity,
        languageCode: 'en',
        routeName: DASHBOARD_ROUTE,
        cityContentPath: `/${selectedCity}/en`,
        forceRefresh: false,
        resetNavigation: true
      })
      expect(navigation.replace).not.toHaveBeenCalled()
      expect(createNavigate).toHaveBeenCalledTimes(1)
      expect(createNavigate).toHaveBeenCalledWith(dispatch, navigation)
      expect(navigateTo).toHaveBeenCalledTimes(1)
      expect(navigateTo).toHaveBeenCalledWith(
        {
          cityCode,
          languageCode: 'en',
          newsId: undefined,
          newsType: LOCAL_NEWS_TYPE,
          route: NEWS_ROUTE
        },
        undefined,
        false
      )
      expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
      expect(sendTrackingSignal).toHaveBeenCalledWith({ signal: { name: OPEN_DEEP_LINK_SIGNAL_NAME, url } })
    })
  })

  describe('jpal tracking links', () => {
    it('should open landing and navigate to tracking links if there is no seleceted city', async () => {
      const url = `https://integreat.app/jpal/abcdef123456`
      await appSettings.setContentLanguage(language)
      await appSettings.setIntroShown()

      await navigateToDeepLink(dispatch, navigation, url, language)

      expect(navigateToCategory).not.toHaveBeenCalled()
      expect(navigation.replace).toHaveBeenCalledTimes(1)
      expect(navigation.replace).toHaveBeenCalledWith(LANDING_ROUTE)
      expect(createNavigate).toHaveBeenCalledTimes(1)
      expect(createNavigate).toHaveBeenCalledWith(dispatch, navigation)
      expect(navigateTo).toHaveBeenCalledTimes(1)
      expect(navigateTo).toHaveBeenCalledWith(
        {
          route: JPAL_TRACKING_ROUTE,
          trackingCode: 'abcdef123456'
        },
        undefined,
        false
      )
      expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
      expect(sendTrackingSignal).toHaveBeenCalledWith({ signal: { name: OPEN_DEEP_LINK_SIGNAL_NAME, url } })
    })

    it('should open dashboard and navigate to tracking links if there is a selected city', async () => {
      const selectedCity = 'testumgebung'
      const url = `https://integreat.app/jpal/abcdef123456`
      await appSettings.setContentLanguage(language)
      await appSettings.setSelectedCity(selectedCity)
      await appSettings.setIntroShown()

      await navigateToDeepLink(dispatch, navigation, url, language)

      expect(navigateToCategory).toHaveBeenCalledTimes(1)
      expect(navigateToCategory).toHaveBeenCalledWith({
        dispatch,
        navigation,
        cityCode: selectedCity,
        languageCode: language,
        routeName: DASHBOARD_ROUTE,
        cityContentPath: `/${selectedCity}/${language}`,
        forceRefresh: false,
        resetNavigation: true
      })
      expect(navigation.replace).not.toHaveBeenCalled()
      expect(createNavigate).toHaveBeenCalledTimes(1)
      expect(createNavigate).toHaveBeenCalledWith(dispatch, navigation)
      expect(navigateTo).toHaveBeenCalledTimes(1)
      expect(navigateTo).toHaveBeenCalledWith(
        {
          route: JPAL_TRACKING_ROUTE,
          trackingCode: 'abcdef123456'
        },
        undefined,
        false
      )
      expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
      expect(sendTrackingSignal).toHaveBeenCalledWith({ signal: { name: OPEN_DEEP_LINK_SIGNAL_NAME, url } })
    })
  })
})
