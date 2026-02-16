import { waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React, { useEffect } from 'react'

import { FeatureFlagsType } from 'build-configs/BuildConfigType'
import {
  BOTTOM_TAB_NAVIGATION_ROUTE,
  CATEGORIES_ROUTE,
  EVENTS_ROUTE,
  INTRO_ROUTE,
  JPAL_TRACKING_ROUTE,
  LANDING_ROUTE,
  LOCAL_NEWS_TYPE,
  NEWS_ROUTE,
  OPEN_DEEP_LINK_SIGNAL_NAME,
} from 'shared'

import buildConfig from '../../constants/buildConfig'
import TestingAppContext from '../../testing/TestingAppContext'
import createNavigationPropMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
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
  const updateSettings = jest.fn()
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
    useEffect(() => {
      navigateToDeepLink(url)
    }, [navigateToDeepLink, url])

    return null
  }

  const renderMockComponent = ({
    url,
    cityCode = null,
    languageCode = selectedLanguageCode,
    introShown = false,
    jpalTrackingCode = '',
    jpalTrackingEnabled = false,
  }: {
    url: string
    cityCode?: string | null
    languageCode?: string
    introShown?: boolean
    jpalTrackingCode?: string
    jpalTrackingEnabled?: boolean
  }) =>
    render(
      <TestingAppContext
        cityCode={cityCode}
        languageCode={languageCode}
        changeCityCode={changeCityCode}
        updateSettings={updateSettings}
        settings={{ introShown, jpalTrackingCode, jpalTrackingEnabled }}>
        <MockComponent url={url} />
      </TestingAppContext>,
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
  })

  describe('landing deep links', () => {
    const url = 'https://integreat.app'

    it('should navigate to the intro slides if not shown yet and enabled in the build config', async () => {
      mockBuildConfig({ introSlides: true, fixedCity: null })
      renderMockComponent({ url })

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
      renderMockComponent({ url, introShown: true })

      await waitFor(() => expect(navigation.reset).toHaveBeenCalledTimes(1))
      expect(navigation.reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: LANDING_ROUTE }] })

      expect(navigateTo).not.toHaveBeenCalled()
      expect(changeCityCode).not.toHaveBeenCalled()
      expectTrackingSignal(url)
    })

    it('should navigate to landing if no city is selected and intro slides disabled', async () => {
      mockBuildConfig({ introSlides: false, fixedCity: null })
      renderMockComponent({ url })

      await waitFor(() => expect(navigation.reset).toHaveBeenCalledTimes(1))
      expect(navigation.reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: LANDING_ROUTE }] })

      expect(navigateTo).not.toHaveBeenCalled()
      expect(changeCityCode).not.toHaveBeenCalled()
      expectTrackingSignal(url)
    })

    it('should navigate to dashboard if there is a fixed city and intro slides already shown', async () => {
      const fixedCity = 'aschaffenburg'
      mockBuildConfig({ introSlides: false, fixedCity })
      renderMockComponent({ url, introShown: true })

      await waitFor(() => expect(navigateTo).toHaveBeenCalledTimes(1))
      expect(navigation.reset).not.toHaveBeenCalled()
      expect(changeCityCode).not.toHaveBeenCalled()
      expectTrackingSignal(url)
    })

    it('should navigate to dashboard if there is already a selected city', async () => {
      const selectedCity = 'nuernberg'
      mockBuildConfig({ introSlides: false, fixedCity: null })
      renderMockComponent({ url, cityCode: selectedCity })

      await waitFor(() => expect(navigation.reset).toHaveBeenCalledTimes(1))
      expect(navigation.reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: BOTTOM_TAB_NAVIGATION_ROUTE, params: {} }],
      })

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
      renderMockComponent({ url })

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
      renderMockComponent({ url, introShown: true })

      await waitFor(() => expect(navigateTo).toHaveBeenCalledTimes(1))
      expect(navigation.reset).not.toHaveBeenCalled()
      expect(changeCityCode).not.toHaveBeenCalled()
      expectTrackingSignal(url)
    })

    it('should navigate to dashboard and use current language if intro slides already shown and no city is selected', async () => {
      const url = `https://integreat.app/${cityCode}`
      mockBuildConfig({ introSlides: false, fixedCity: null })
      renderMockComponent({ url, introShown: true })

      await waitFor(() => expect(navigateTo).toHaveBeenCalledTimes(1))
      expect(navigation.reset).not.toHaveBeenCalled()
      expect(changeCityCode).not.toHaveBeenCalled()
      expectTrackingSignal(url)
    })

    it('should open selected city dashboard and call navigateTo if city code in link differs', async () => {
      const selectedCity = 'testumgebung'
      mockBuildConfig({ introSlides: false, fixedCity: null })
      renderMockComponent({ url, cityCode: selectedCity, introShown: true })

      await waitFor(() => expect(navigateTo).toHaveBeenCalledTimes(1))
      expect(navigation.reset).not.toHaveBeenCalled()
      expect(changeCityCode).not.toHaveBeenCalled()
      expectTrackingSignal(url)
    })

    it('should open selected city dashboard and call navigateTo if language code in link differs', async () => {
      const selectedCity = 'testumgebung'
      const languageCode = 'ar'
      const url = `https://integreat.app/${selectedCity}/${languageCode}`
      mockBuildConfig({ introSlides: false, fixedCity: null })
      renderMockComponent({ url, cityCode: selectedCity, introShown: true })

      await waitFor(() => expect(navigateTo).toHaveBeenCalledTimes(1))
      expect(navigation.reset).not.toHaveBeenCalled()
      expect(changeCityCode).not.toHaveBeenCalled()
      expectTrackingSignal(url)
    })

    it('should not navigate to link if fixed city differs from link city', async () => {
      const fixedCity = 'aschaffenburg'
      mockBuildConfig({ introSlides: false, fixedCity })
      renderMockComponent({ url })

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
      renderMockComponent({ url })

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
      renderMockComponent({ url, cityCode, introShown: true })

      await waitFor(() => expect(navigateTo).toHaveBeenCalledTimes(1))
      expect(navigation.reset).not.toHaveBeenCalled()
      expect(changeCityCode).not.toHaveBeenCalled()
      expectTrackingSignal(url)
    })

    it('should open selected city dashboard and navigate to route', async () => {
      const selectedCity = 'testumgebung'
      const url = `https://integreat.app/${cityCode}/en/news`
      mockBuildConfig({ introSlides: false, fixedCity: null })
      renderMockComponent({ url, cityCode: selectedCity, introShown: true })

      await waitFor(() => expect(navigateTo).toHaveBeenCalledTimes(1))
      expect(navigation.reset).not.toHaveBeenCalled()
      expect(changeCityCode).not.toHaveBeenCalled()
      expectTrackingSignal(url)
    })
  })

  describe('jpal tracking links', () => {
    it('should open landing and navigate to tracking links if there is no seleceted city', async () => {
      const url = `https://integreat.app/jpal/abcdef123456`
      renderMockComponent({ url, introShown: true })

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
      renderMockComponent({ url, cityCode: selectedCity, introShown: true })

      await waitFor(() => expect(navigation.reset).toHaveBeenCalledTimes(1))
      expect(navigation.reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: BOTTOM_TAB_NAVIGATION_ROUTE, params: {} }],
      })
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
      renderMockComponent({ url, introShown: true, jpalTrackingCode: 'outdated-tracking-code' })

      expect(updateSettings).toHaveBeenCalledTimes(1)
      expect(updateSettings).toHaveBeenCalledWith({ jpalTrackingCode: 'abcdef123456' })
    })

    it('should disable japl tracking if there is no tracking code', async () => {
      mockBuildConfig({ jpalTracking: true })
      const url = `https://integreat.app/jpal`
      renderMockComponent({
        url,
        introShown: true,
        jpalTrackingEnabled: true,
        jpalTrackingCode: 'outdated-tracking-code',
      })

      expect(updateSettings).toHaveBeenCalledTimes(1)
      expect(updateSettings).toHaveBeenCalledWith({ jpalTrackingEnabled: false })
    })
  })
})
