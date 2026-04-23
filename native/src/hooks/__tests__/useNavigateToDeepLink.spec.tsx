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

  const changeRegionCode = jest.fn()
  const updateSettings = jest.fn()
  const selectedLanguageCode = 'de'

  const mockBuildConfig = (featureFlags: Partial<FeatureFlagsType>) => {
    const previous = buildConfig()
    // @ts-expect-error passing only a partial of fixed region type leads to ts errors that are irrelevant for testing though
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
    regionCode = null,
    languageCode = selectedLanguageCode,
    introShown = false,
  }: {
    url: string
    regionCode?: string | null
    languageCode?: string
    introShown?: boolean
  }) =>
    render(
      <TestingAppContext
        regionCode={regionCode}
        languageCode={languageCode}
        changeRegionCode={changeRegionCode}
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

    it('should navigate to landing if no region is selected and intro slides already shown', async () => {
      mockBuildConfig({ introSlides: false, fixedRegion: null })
      renderMockComponent({ url, introShown: true })

      await waitFor(() => expect(navigation.reset).toHaveBeenCalledTimes(1))
      expect(navigation.reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: LANDING_ROUTE }] })

      expect(navigateTo).not.toHaveBeenCalled()
      expect(changeRegionCode).not.toHaveBeenCalled()
    })

    it('should navigate to landing if no region is selected and intro slides disabled', async () => {
      mockBuildConfig({ introSlides: false, fixedRegion: null })
      renderMockComponent({ url })

      await waitFor(() => expect(navigation.reset).toHaveBeenCalledTimes(1))
      expect(navigation.reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: LANDING_ROUTE }] })

      expect(navigateTo).not.toHaveBeenCalled()
      expect(changeRegionCode).not.toHaveBeenCalled()
    })

    it('should navigate to dashboard if there is a fixed region and intro slides already shown', async () => {
      const fixedRegion = 'aschaffenburg'
      mockBuildConfig({ introSlides: false, fixedRegion })
      renderMockComponent({ url, introShown: true })

      await waitFor(() => expect(navigateTo).toHaveBeenCalledTimes(1))
      expect(navigation.reset).not.toHaveBeenCalled()
      expect(changeRegionCode).toHaveBeenCalledTimes(1)
      expect(changeRegionCode).toHaveBeenCalledWith('aschaffenburg')
    })

    it('should navigate to dashboard if there is already a selected region', async () => {
      const selectedRegion = 'nuernberg'
      mockBuildConfig({ introSlides: false, fixedRegion: null })
      renderMockComponent({ url, regionCode: selectedRegion })

      await waitFor(() => expect(navigateTo).toHaveBeenCalledTimes(1))
      expect(navigateTo).toHaveBeenCalledWith({
        route: LANDING_ROUTE,
        languageCode: selectedLanguageCode,
      })

      expect(changeRegionCode).not.toHaveBeenCalled()
    })
  })

  describe('dashboard deep links', () => {
    const regionCode = `muenchen`
    const url = `https://integreat.app/${regionCode}/${selectedLanguageCode}`

    it('should navigate to dashboard if intro slides already shown and no region is selected', async () => {
      mockBuildConfig({ introSlides: false, fixedRegion: null })
      renderMockComponent({ url, introShown: true })

      await waitFor(() => expect(navigateTo).toHaveBeenCalledTimes(1))
      expect(navigation.reset).not.toHaveBeenCalled()
      expect(changeRegionCode).toHaveBeenCalledTimes(1)
      expect(changeRegionCode).toHaveBeenCalledWith(regionCode)
    })

    it('should navigate to dashboard and use current language if intro slides already shown and no region is selected', async () => {
      const url = `https://integreat.app/${regionCode}`
      mockBuildConfig({ introSlides: false, fixedRegion: null })
      renderMockComponent({ url, introShown: true })

      await waitFor(() => expect(navigateTo).toHaveBeenCalledTimes(1))
      expect(navigation.reset).not.toHaveBeenCalled()
      expect(changeRegionCode).toHaveBeenCalledTimes(1)
      expect(changeRegionCode).toHaveBeenCalledWith(regionCode)
    })

    it('should open selected region dashboard and call navigateTo if region code in link differs', async () => {
      const selectedRegion = 'testumgebung'
      mockBuildConfig({ introSlides: false, fixedRegion: null })
      renderMockComponent({ url, regionCode: selectedRegion, introShown: true })

      await waitFor(() => expect(navigateTo).toHaveBeenCalledTimes(1))
      expect(navigation.reset).not.toHaveBeenCalled()
      expect(changeRegionCode).not.toHaveBeenCalled()
    })

    it('should open selected region dashboard and call navigateTo if language code in link differs', async () => {
      const selectedRegion = 'testumgebung'
      const languageCode = 'ar'
      const url = `https://integreat.app/${selectedRegion}/${languageCode}`
      mockBuildConfig({ introSlides: false, fixedRegion: null })
      renderMockComponent({ url, regionCode: selectedRegion, introShown: true })

      await waitFor(() => expect(navigateTo).toHaveBeenCalledTimes(1))
      expect(navigation.reset).not.toHaveBeenCalled()
      expect(changeRegionCode).not.toHaveBeenCalled()
    })

    it('should not navigate to link if fixed region differs from link region', async () => {
      const fixedRegion = 'aschaffenburg'
      mockBuildConfig({ introSlides: false, fixedRegion })
      renderMockComponent({ url })

      await waitFor(() => expect(showSnackbar).toHaveBeenCalledTimes(1))
      expect(showSnackbar).toHaveBeenCalledWith({ text: 'notFound.category' })

      expect(navigation.reset).not.toHaveBeenCalled()
      expect(navigateTo).not.toHaveBeenCalled()
      expect(changeRegionCode).not.toHaveBeenCalled()
    })
  })

  describe('region content deep links', () => {
    const regionCode = `muenchen`
    const languageCode = `ar`

    it('should open dashboard and navigate to events route if intro slides already shown', async () => {
      const url = `https://integreat.app/${regionCode}/${languageCode}/events/some-event`
      mockBuildConfig({ introSlides: false, fixedRegion: null })
      renderMockComponent({ url, regionCode, introShown: true })

      await waitFor(() => expect(navigateTo).toHaveBeenCalledTimes(1))
      expect(navigation.reset).not.toHaveBeenCalled()
      expect(changeRegionCode).not.toHaveBeenCalled()
    })

    it('should open selected region dashboard and navigate to route', async () => {
      const selectedRegion = 'testumgebung'
      const url = `https://integreat.app/${regionCode}/en/news`
      mockBuildConfig({ introSlides: false, fixedRegion: null })
      renderMockComponent({ url, regionCode: selectedRegion, introShown: true })

      await waitFor(() => expect(navigateTo).toHaveBeenCalledTimes(1))
      expect(navigation.reset).not.toHaveBeenCalled()
      expect(changeRegionCode).not.toHaveBeenCalled()
    })
  })
})
