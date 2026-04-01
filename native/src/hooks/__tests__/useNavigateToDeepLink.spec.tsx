import { waitFor } from '@testing-library/react-native'
import React, { useEffect } from 'react'

import { FeatureFlagsType } from 'build-configs/BuildConfigType'
import { LANDING_ROUTE } from 'shared'

import buildConfig from '../../constants/buildConfig'
import TestingAppContext from '../../testing/TestingAppContext'
import createNavigationPropMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import useNavigate from '../useNavigate'
import useNavigateToDeepLink from '../useNavigateToDeepLink'
import useSnackbar from '../useSnackbar'

jest.mock('../useNavigate')
jest.mock('../useSnackbar')

describe('useNavigateToDeepLink', () => {
  const { mocked } = jest
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
    // @ts-expect-error passing only a partial of fixed city type leads to ts errors that are irrelevant for testing though
    mockedBuildConfig.mockImplementation(() => ({
      ...previous,
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
  }: {
    url: string
    cityCode?: string | null
    languageCode?: string
    introShown?: boolean
  }) =>
    render(
      <TestingAppContext
        cityCode={cityCode}
        languageCode={languageCode}
        changeCityCode={changeCityCode}
        updateSettings={updateSettings}
        settings={{ introShown }}>
        <MockComponent url={url} />
      </TestingAppContext>,
    )

  beforeEach(async () => {
    jest.clearAllMocks()
  })

  describe('landing deep links', () => {
    const url = 'https://integreat.app'

    it('should navigate to landing if no city is selected and intro slides already shown', async () => {
      mockBuildConfig({ introSlides: false, fixedCity: null })
      renderMockComponent({ url, introShown: true })

      await waitFor(() => expect(navigation.reset).toHaveBeenCalledTimes(1))
      expect(navigation.reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: LANDING_ROUTE }] })

      expect(navigateTo).not.toHaveBeenCalled()
      expect(changeCityCode).not.toHaveBeenCalled()
    })

    it('should navigate to landing if no city is selected and intro slides disabled', async () => {
      mockBuildConfig({ introSlides: false, fixedCity: null })
      renderMockComponent({ url })

      await waitFor(() => expect(navigation.reset).toHaveBeenCalledTimes(1))
      expect(navigation.reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: LANDING_ROUTE }] })

      expect(navigateTo).not.toHaveBeenCalled()
      expect(changeCityCode).not.toHaveBeenCalled()
    })

    it('should navigate to dashboard if there is a fixed city and intro slides already shown', async () => {
      const fixedCity = 'aschaffenburg'
      mockBuildConfig({ introSlides: false, fixedCity })
      renderMockComponent({ url, introShown: true })

      await waitFor(() => expect(navigateTo).toHaveBeenCalledTimes(1))
      expect(navigation.reset).not.toHaveBeenCalled()
      expect(changeCityCode).toHaveBeenCalledTimes(1)
      expect(changeCityCode).toHaveBeenCalledWith('aschaffenburg')
    })

    it('should navigate to dashboard if there is already a selected city', async () => {
      const selectedCity = 'nuernberg'
      mockBuildConfig({ introSlides: false, fixedCity: null })
      renderMockComponent({ url, cityCode: selectedCity })

      await waitFor(() => expect(navigateTo).toHaveBeenCalledTimes(1))
      expect(navigateTo).toHaveBeenCalledWith({
        route: LANDING_ROUTE,
        languageCode: selectedLanguageCode,
      })

      expect(changeCityCode).not.toHaveBeenCalled()
    })
  })

  describe('dashboard deep links', () => {
    const cityCode = `muenchen`
    const url = `https://integreat.app/${cityCode}/${selectedLanguageCode}`

    it('should navigate to dashboard if intro slides already shown and no city is selected', async () => {
      mockBuildConfig({ introSlides: false, fixedCity: null })
      renderMockComponent({ url, introShown: true })

      await waitFor(() => expect(navigateTo).toHaveBeenCalledTimes(1))
      expect(navigation.reset).not.toHaveBeenCalled()
      expect(changeCityCode).toHaveBeenCalledTimes(1)
      expect(changeCityCode).toHaveBeenCalledWith(cityCode)
    })

    it('should navigate to dashboard and use current language if intro slides already shown and no city is selected', async () => {
      const url = `https://integreat.app/${cityCode}`
      mockBuildConfig({ introSlides: false, fixedCity: null })
      renderMockComponent({ url, introShown: true })

      await waitFor(() => expect(navigateTo).toHaveBeenCalledTimes(1))
      expect(navigation.reset).not.toHaveBeenCalled()
      expect(changeCityCode).toHaveBeenCalledTimes(1)
      expect(changeCityCode).toHaveBeenCalledWith(cityCode)
    })

    it('should open selected city dashboard and call navigateTo if city code in link differs', async () => {
      const selectedCity = 'testumgebung'
      mockBuildConfig({ introSlides: false, fixedCity: null })
      renderMockComponent({ url, cityCode: selectedCity, introShown: true })

      await waitFor(() => expect(navigateTo).toHaveBeenCalledTimes(1))
      expect(navigation.reset).not.toHaveBeenCalled()
      expect(changeCityCode).not.toHaveBeenCalled()
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
    })
  })

  describe('city content deep links', () => {
    const cityCode = `muenchen`
    const languageCode = `ar`

    it('should open dashboard and navigate to events route if intro slides already shown', async () => {
      const url = `https://integreat.app/${cityCode}/${languageCode}/events/some-event`
      mockBuildConfig({ introSlides: false, fixedCity: null })
      renderMockComponent({ url, cityCode, introShown: true })

      await waitFor(() => expect(navigateTo).toHaveBeenCalledTimes(1))
      expect(navigation.reset).not.toHaveBeenCalled()
      expect(changeCityCode).not.toHaveBeenCalled()
    })

    it('should open selected city dashboard and navigate to route', async () => {
      const selectedCity = 'testumgebung'
      const url = `https://integreat.app/${cityCode}/en/news`
      mockBuildConfig({ introSlides: false, fixedCity: null })
      renderMockComponent({ url, cityCode: selectedCity, introShown: true })

      await waitFor(() => expect(navigateTo).toHaveBeenCalledTimes(1))
      expect(navigation.reset).not.toHaveBeenCalled()
      expect(changeCityCode).not.toHaveBeenCalled()
    })
  })
})
