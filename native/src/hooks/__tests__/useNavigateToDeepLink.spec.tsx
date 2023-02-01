import { waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React, { useEffect } from 'react'

import {
  CATEGORIES_ROUTE,
  EVENTS_ROUTE,
  INTRO_ROUTE,
  JPAL_TRACKING_ROUTE,
  LANDING_ROUTE,
  LOCAL_NEWS_TYPE,
  NEWS_ROUTE,
  OFFERS_ROUTE,
  OPEN_DEEP_LINK_SIGNAL_NAME,
} from 'api-client'
import { FeatureFlagsType } from 'build-configs/BuildConfigType'

import buildConfig from '../../constants/buildConfig'
import { AppContext } from '../../contexts/AppContextProvider'
import createNavigationPropMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import appSettings from '../../utils/AppSettings'
import sendTrackingSignal from '../../utils/sendTrackingSignal'
import useNavigate from '../useNavigate'
import useNavigateToDeepLink from '../useNavigateToDeepLink'
import useSnackbar from '../useSnackbar'

jest.mock('../useNavigate')
jest.mock('../useSnackbar')
jest.mock('../../utils/sendTrackingSignal')

describe('useNavigateToDeepLink', () => {
  const mockedBuildConfig = mocked(buildConfig)
  const showSnackbar = jest.fn()
  const navigateTo = jest.fn()
  const navigation = createNavigationPropMock()
  mocked(useSnackbar).mockImplementation(() => showSnackbar)
  mocked(useNavigate).mockImplementation(() => ({ navigateTo, navigation }))

  const changeCityCode = jest.fn()
  const changeLanguageCode = jest.fn()
  const selectedLanguageCode = 'de'

  const mockBuildConfig = (featureFlags: Partial<FeatureFlagsType>) => {
    const previous = buildConfig()
    mockedBuildConfig.mockImplementation(() => ({
      ...previous,
      // @ts-expect-error passing only a partial of fixed city type leads to ts errors that are irrelevant for testing though
      featureFlags: { ...previous.featureFlags, ...featureFlags },
    }))
  }

  const MockComponent = ({ url }: { url: string }) => {
    const navigateToDeepLink = useNavigateToDeepLink()
    useEffect(() => navigateToDeepLink(url), [navigateToDeepLink, url])

    return null
  }

  const renderMockComponent = (url: string, cityCode: string | null = null, languageCode = selectedLanguageCode) =>
    render(
      <AppContext.Provider value={{ changeCityCode, changeLanguageCode, cityCode, languageCode }}>
        <MockComponent url={url} />
      </AppContext.Provider>
    )

  const expectTrackingSignal = (url: string) => {
    expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: {
        name: OPEN_DEEP_LINK_SIGNAL_NAME,
        url,
      },
    })
  }

  beforeEach(async () => {
    jest.clearAllMocks()
    await appSettings.clearAppSettings()
  })

  describe('landing deep links', () => {
    const url = 'https://integreat.app'

    it('should navigate to the intro slides if not shown yet and enabled in the build config', async () => {
      mockBuildConfig({ introSlides: true, fixedCity: null })
      renderMockComponent(url)

      await waitFor(() => expect(navigation.replace).toHaveBeenCalledTimes(1))
      expect(navigation.replace).toHaveBeenCalledWith(INTRO_ROUTE, {
        deepLink: url,
      })

      expect(navigateTo).not.toHaveBeenCalled()
      expect(changeCityCode).not.toHaveBeenCalled()
      expectTrackingSignal(url)
    })

    it('should navigate to landing if no city is selected and intro slides already shown', async () => {
      mockBuildConfig({ introSlides: false, fixedCity: null })
      await appSettings.setIntroShown()
      renderMockComponent(url)

      await waitFor(() => expect(navigation.reset).toHaveBeenCalledTimes(1))
      expect(navigation.reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: LANDING_ROUTE }] })

      expect(navigateTo).not.toHaveBeenCalled()
      expect(changeCityCode).not.toHaveBeenCalled()
      expectTrackingSignal(url)
    })

    it('should navigate to landing if no city is selected and intro slides disabled', async () => {
      mockBuildConfig({ introSlides: false, fixedCity: null })
      renderMockComponent(url)

      await waitFor(() => expect(navigation.reset).toHaveBeenCalledTimes(1))
      expect(navigation.reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: LANDING_ROUTE }] })

      expect(navigateTo).not.toHaveBeenCalled()
      expect(changeCityCode).not.toHaveBeenCalled()
      expectTrackingSignal(url)
    })

    it('should navigate to dashboard if there is a fixed city and intro slides already shown', async () => {
      const fixedCity = 'aschaffenburg'
      mockBuildConfig({ introSlides: false, fixedCity })
      await appSettings.setIntroShown()
      renderMockComponent(url)

      await waitFor(() => expect(navigation.reset).toHaveBeenCalledTimes(1))
      expect(navigation.reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: CATEGORIES_ROUTE, params: {} }] })

      expect(changeCityCode).toHaveBeenCalledTimes(1)
      expect(changeCityCode).toHaveBeenCalledWith(fixedCity)

      expect(navigateTo).not.toHaveBeenCalled()
      expectTrackingSignal(url)
    })

    it('should navigate to dashboard if there is already a selected city', async () => {
      const selectedCity = 'nuernberg'
      mockBuildConfig({ introSlides: false, fixedCity: null })
      renderMockComponent(url, selectedCity)

      await waitFor(() => expect(navigation.reset).toHaveBeenCalledTimes(1))
      expect(navigation.reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: CATEGORIES_ROUTE, params: {} }] })

      expect(changeCityCode).not.toHaveBeenCalled()
      expect(navigateTo).not.toHaveBeenCalled()
      expectTrackingSignal(url)
    })
  })

  describe('dashboard deep links', () => {
    const cityCode = `muenchen`
    const url = `https://integreat.app/${cityCode}/${selectedLanguageCode}`

    it('should navigate to the intro slides if not shown yet and enabled in the build config', async () => {
      mockBuildConfig({ introSlides: true, fixedCity: null })
      renderMockComponent(url)

      await waitFor(() => expect(navigation.replace).toHaveBeenCalledTimes(1))
      expect(navigation.replace).toHaveBeenCalledWith(INTRO_ROUTE, {
        deepLink: url,
      })

      expect(navigateTo).not.toHaveBeenCalled()
      expect(changeCityCode).not.toHaveBeenCalled()
      expectTrackingSignal(url)
    })

    it('should navigate to dashboard if intro slides already shown and no city is selected', async () => {
      mockBuildConfig({ introSlides: false, fixedCity: null })
      await appSettings.setIntroShown()
      renderMockComponent(url)

      await waitFor(() => expect(navigation.reset).toHaveBeenCalledTimes(1))
      expect(navigation.reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: CATEGORIES_ROUTE, params: {} }] })

      expect(changeCityCode).toHaveBeenCalledTimes(1)
      expect(changeCityCode).toHaveBeenCalledWith(cityCode)

      expect(navigateTo).not.toHaveBeenCalled()
      expectTrackingSignal(url)
    })

    it('should navigate to dashboard and use current language if intro slides already shown and no city is selected', async () => {
      const url = `https://integreat.app/${cityCode}`
      mockBuildConfig({ introSlides: false, fixedCity: null })
      await appSettings.setIntroShown()
      renderMockComponent(url)

      await waitFor(() => expect(navigation.reset).toHaveBeenCalledTimes(1))
      expect(navigation.reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: CATEGORIES_ROUTE, params: {} }] })

      expect(changeCityCode).toHaveBeenCalledTimes(1)
      expect(changeCityCode).toHaveBeenCalledWith(cityCode)

      expect(navigateTo).not.toHaveBeenCalled()
      expectTrackingSignal(url)
    })

    it('should open selected city dashboard and call navigateTo if city code in link differs', async () => {
      const selectedCity = 'testumgebung'
      mockBuildConfig({ introSlides: false, fixedCity: null })
      await appSettings.setIntroShown()
      renderMockComponent(url, selectedCity)

      await waitFor(() => expect(navigation.reset).toHaveBeenCalledTimes(1))
      expect(navigation.reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: CATEGORIES_ROUTE, params: {} }] })

      expect(navigateTo).toHaveBeenCalledTimes(1)
      expect(navigateTo).toHaveBeenCalledWith({
        cityCode,
        languageCode: selectedLanguageCode,
        cityContentPath: `/${cityCode}/${selectedLanguageCode}`,
        route: CATEGORIES_ROUTE,
      })
      expect(changeCityCode).not.toHaveBeenCalled()
      expectTrackingSignal(url)
    })

    it('should open selected city dashboard and call navigateTo if language code in link differs', async () => {
      const selectedCity = 'testumgebung'
      const languageCode = 'ar'
      const url = `https://integreat.app/${selectedCity}/${languageCode}`
      mockBuildConfig({ introSlides: false, fixedCity: null })
      await appSettings.setIntroShown()
      renderMockComponent(url, selectedCity)

      await waitFor(() => expect(navigation.reset).toHaveBeenCalledTimes(1))
      expect(navigation.reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: CATEGORIES_ROUTE, params: {} }] })

      expect(navigateTo).toHaveBeenCalledTimes(1)
      expect(navigateTo).toHaveBeenCalledWith({
        cityCode: selectedCity,
        languageCode,
        cityContentPath: `/${selectedCity}/${languageCode}`,
        route: CATEGORIES_ROUTE,
      })

      expect(changeCityCode).not.toHaveBeenCalled()
      expectTrackingSignal(url)
    })

    it('should not navigate to link if fixed city differs from link city', async () => {
      const fixedCity = 'aschaffenburg'
      mockBuildConfig({ introSlides: false, fixedCity })
      renderMockComponent(url)

      await waitFor(() => expect(showSnackbar).toHaveBeenCalledTimes(1))
      expect(showSnackbar).toHaveBeenCalledWith({ text: 'notFound.category' })

      expect(navigation.reset).not.toHaveBeenCalled()
      expect(navigateTo).not.toHaveBeenCalled()
      expect(changeCityCode).not.toHaveBeenCalled()
      expectTrackingSignal(url)
    })
  })

  describe('city content deep links', () => {
    const cityCode = `muenchen`
    const languageCode = `ar`

    it('should navigate to the intro slides if not shown yet and enabled in the build config', async () => {
      const url = `https://integreat.app/${cityCode}/${languageCode}/events/some-event`
      mockBuildConfig({ introSlides: true, fixedCity: null })
      renderMockComponent(url)

      await waitFor(() => expect(navigation.replace).toHaveBeenCalledTimes(1))
      expect(navigation.replace).toHaveBeenCalledWith(INTRO_ROUTE, {
        deepLink: url,
      })

      expect(navigateTo).not.toHaveBeenCalled()
      expect(changeCityCode).not.toHaveBeenCalled()
      expectTrackingSignal(url)
    })

    it('should open dashboard and navigate to events route if intro slides already shown', async () => {
      const url = `https://integreat.app/${cityCode}/${languageCode}/events/some-event`
      mockBuildConfig({ introSlides: false, fixedCity: null })
      await appSettings.setIntroShown()
      renderMockComponent(url, cityCode)

      await waitFor(() => expect(navigation.reset).toHaveBeenCalledTimes(1))
      expect(navigation.reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: CATEGORIES_ROUTE, params: {} }] })
      expect(navigateTo).toHaveBeenCalledTimes(1)
      expect(navigateTo).toHaveBeenCalledWith({
        cityCode,
        languageCode,
        slug: 'some-event',
        route: EVENTS_ROUTE,
      })

      expect(changeCityCode).not.toHaveBeenCalled()
      expectTrackingSignal(url)
    })

    it('should open dashboard and navigate to offers route if intro slides already shown', async () => {
      const url = `https://integreat.app/${cityCode}/${languageCode}/offers`
      mockBuildConfig({ introSlides: false, fixedCity: null })
      await appSettings.setIntroShown()
      renderMockComponent(url)

      await waitFor(() => expect(navigation.reset).toHaveBeenCalledTimes(1))
      expect(navigation.reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: CATEGORIES_ROUTE, params: {} }] })
      expect(navigateTo).toHaveBeenCalledTimes(1)
      expect(navigateTo).toHaveBeenCalledWith({
        cityCode,
        languageCode,
        route: OFFERS_ROUTE,
      })

      expect(changeCityCode).toHaveBeenCalledTimes(1)
      expect(changeCityCode).toHaveBeenCalledWith(cityCode)

      expectTrackingSignal(url)
    })

    it('should open selected city dashboard and navigate to route', async () => {
      const selectedCity = 'testumgebung'
      const url = `https://integreat.app/${cityCode}/en/news`
      mockBuildConfig({ introSlides: false, fixedCity: null })
      await appSettings.setIntroShown()
      renderMockComponent(url, selectedCity)

      await waitFor(() => expect(navigation.reset).toHaveBeenCalledTimes(1))
      expect(navigation.reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: CATEGORIES_ROUTE, params: {} }] })
      expect(navigateTo).toHaveBeenCalledTimes(1)
      expect(navigateTo).toHaveBeenCalledWith({
        cityCode,
        languageCode: 'en',
        newsId: undefined,
        newsType: LOCAL_NEWS_TYPE,
        route: NEWS_ROUTE,
      })

      expect(changeCityCode).not.toHaveBeenCalled()
      expectTrackingSignal(url)
    })
  })

  describe('jpal tracking links', () => {
    it('should open landing and navigate to tracking links if there is no seleceted city', async () => {
      const url = `https://integreat.app/jpal/abcdef123456`
      await appSettings.setIntroShown()
      renderMockComponent(url)

      await waitFor(() => expect(navigation.reset).toHaveBeenCalledTimes(1))
      expect(navigation.reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: LANDING_ROUTE }] })
      expect(navigateTo).toHaveBeenCalledTimes(1)
      expect(navigateTo).toHaveBeenCalledWith({
        route: JPAL_TRACKING_ROUTE,
        trackingCode: 'abcdef123456',
      })

      expect(changeCityCode).not.toHaveBeenCalled()
      expectTrackingSignal(url)
    })

    it('should open dashboard and navigate to tracking links if there is a selected city', async () => {
      const selectedCity = 'testumgebung'
      const url = `https://integreat.app/jpal`
      await appSettings.setIntroShown()
      renderMockComponent(url, selectedCity)

      await waitFor(() => expect(navigation.reset).toHaveBeenCalledTimes(1))
      expect(navigation.reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: CATEGORIES_ROUTE, params: {} }] })
      expect(navigateTo).toHaveBeenCalledTimes(1)
      expect(navigateTo).toHaveBeenCalledWith({
        route: JPAL_TRACKING_ROUTE,
        trackingCode: null,
      })

      expect(changeCityCode).not.toHaveBeenCalled()
      expectTrackingSignal(url)
    })

    it('should persist tracking code', async () => {
      mockBuildConfig({ jpalTracking: true })
      const url = `https://integreat.app/jpal/abcdef123456`
      await appSettings.setIntroShown()
      await appSettings.setJpalTrackingCode('outdated-tracking-code')
      renderMockComponent(url)

      await waitFor(async () => {
        const { jpalTrackingEnabled, jpalTrackingCode } = await appSettings.loadSettings()
        expect(jpalTrackingEnabled).toBeNull()
        expect(jpalTrackingCode).toBe('abcdef123456')
      })
    })

    it('should disable japl tracking if there is no tracking code', async () => {
      mockBuildConfig({ jpalTracking: true })
      const url = `https://integreat.app/jpal`
      await appSettings.setIntroShown()
      await appSettings.setJpalTrackingEnabled(true)
      await appSettings.setJpalTrackingCode('outdated-tracking-code')
      renderMockComponent(url)

      await waitFor(async () => {
        const { jpalTrackingEnabled, jpalTrackingCode } = await appSettings.loadSettings()
        expect(jpalTrackingEnabled).toBe(false)
        expect(jpalTrackingCode).toBe('outdated-tracking-code')
      })
    })
  })
})
