import { mocked } from 'jest-mock'
import React, { useEffect } from 'react'

import {
  IMAGE_VIEW_MODAL_ROUTE,
  LANDING_ROUTE,
  OPEN_INTERNAL_LINK_SIGNAL_NAME,
  OPEN_MEDIA_SIGNAL_NAME,
  PDF_VIEW_MODAL_ROUTE,
} from 'shared'

import TestingAppContext from '../../testing/TestingAppContext'
import createNavigationPropMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import openExternalUrl from '../../utils/openExternalUrl'
import sendTrackingSignal from '../../utils/sendTrackingSignal'
import useNavigate from '../useNavigate'
import useNavigateToLink from '../useNavigateToLink'
import useSnackbar from '../useSnackbar'

jest.mock('../../utils/sendTrackingSignal')
jest.mock('../../utils/openExternalUrl')
jest.mock('../useNavigate')
jest.mock('../useSnackbar')

describe('useNavigateToLink', () => {
  const showSnackbar = jest.fn()
  const navigateTo = jest.fn()
  const navigation = createNavigationPropMock()
  mocked(useSnackbar).mockImplementation(() => showSnackbar)
  mocked(useNavigate).mockImplementation(() => ({ navigateTo, navigation }))
  const languageCode = 'de'

  const MockComponent = ({ url }: { url: string }) => {
    const navigateToLink = useNavigateToLink()
    useEffect(() => {
      navigateToLink(url)
    }, [navigateToLink, url])

    return null
  }

  const renderMockComponent = (url: string) =>
    render(
      <TestingAppContext>
        <MockComponent url={url} />
      </TestingAppContext>,
    )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should navigate to pdf modal route', () => {
    const url = 'https://example.com/my.pdf'
    renderMockComponent(url)
    expect(navigation.navigate).toHaveBeenCalledTimes(1)
    expect(navigation.navigate).toHaveBeenCalledWith(PDF_VIEW_MODAL_ROUTE, { url, shareUrl: url })
    expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: {
        name: OPEN_MEDIA_SIGNAL_NAME,
        url,
      },
    })
    expect(navigateTo).not.toHaveBeenCalled()
    expect(openExternalUrl).not.toHaveBeenCalled()
  })

  it('should navigate to image modal route for jpgs', () => {
    const url = 'https://example.com/my.jpg'
    renderMockComponent(url)
    expect(navigation.navigate).toHaveBeenCalledTimes(1)
    expect(navigation.navigate).toHaveBeenCalledWith(IMAGE_VIEW_MODAL_ROUTE, {
      url,
      shareUrl: url,
    })
    expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: {
        name: OPEN_MEDIA_SIGNAL_NAME,
        url,
      },
    })
    expect(navigateTo).not.toHaveBeenCalled()
    expect(openExternalUrl).not.toHaveBeenCalled()
  })

  it('should navigate to image modal route for jpegs', () => {
    const url = 'https://example.com/my.jpeg'
    renderMockComponent(url)
    expect(navigation.navigate).toHaveBeenCalledTimes(1)
    expect(navigation.navigate).toHaveBeenCalledWith(IMAGE_VIEW_MODAL_ROUTE, {
      url,
      shareUrl: url,
    })
    expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: {
        name: OPEN_MEDIA_SIGNAL_NAME,
        url,
      },
    })
    expect(navigateTo).not.toHaveBeenCalled()
    expect(openExternalUrl).not.toHaveBeenCalled()
  })

  it('should navigate to image modal route for pngs', () => {
    const url = 'https://example.com/my.png1'
    renderMockComponent(url)
    expect(navigation.navigate).toHaveBeenCalledTimes(1)
    expect(navigation.navigate).toHaveBeenCalledWith(IMAGE_VIEW_MODAL_ROUTE, {
      url,
      shareUrl: url,
    })
    expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: {
        name: OPEN_MEDIA_SIGNAL_NAME,
        url,
      },
    })
    expect(navigateTo).not.toHaveBeenCalled()
    expect(openExternalUrl).not.toHaveBeenCalled()
  })

  it('should call navigateTo for internal links', () => {
    const url = 'https://integreat.app'
    renderMockComponent(url)
    expect(navigateTo).toHaveBeenCalledTimes(1)
    expect(navigateTo).toHaveBeenCalledWith({
      route: LANDING_ROUTE,
      languageCode,
    })
    expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: {
        name: OPEN_INTERNAL_LINK_SIGNAL_NAME,
        url,
      },
    })
    expect(navigation.navigate).not.toHaveBeenCalled()
    expect(openExternalUrl).not.toHaveBeenCalled()
  })

  it('should call openExternalUrl for external links', () => {
    const url = 'https://example.com'
    renderMockComponent(url)
    expect(openExternalUrl).toHaveBeenCalledTimes(1)
    expect(openExternalUrl).toHaveBeenCalledWith(url, expect.any(Function))
    expect(sendTrackingSignal).not.toHaveBeenCalled()
    expect(navigation.navigate).not.toHaveBeenCalled()
    expect(navigateTo).not.toHaveBeenCalled()
  })
})
