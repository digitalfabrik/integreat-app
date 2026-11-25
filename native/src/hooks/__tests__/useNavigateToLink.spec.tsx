import React, { useEffect } from 'react'

import { IMAGE_VIEW_ROUTE, REGIONS_ROUTE, PDF_VIEW_ROUTE } from 'shared'

import TestingAppContext from '../../testing/TestingAppContext'
import createNavigationPropMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import useNavigate from '../useNavigate'
import useNavigateToLink from '../useNavigateToLink'
import useSnackbar from '../useSnackbar'

const openExternalUrl = jest.fn()
jest.mock('../../utils/openExternalUrl', () => ({
  __esModule: true,
  default: () => openExternalUrl,
}))
jest.mock('../useNavigate')
jest.mock('../useSnackbar')

describe('useNavigateToLink', () => {
  const showSnackbar = jest.fn()
  const navigateTo = jest.fn()
  const navigation = createNavigationPropMock()
  const { mocked } = jest
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

  it('should navigate to pdf modal route', async () => {
    const url = 'https://example.com/my.pdf'
    await renderMockComponent(url)
    expect(navigation.navigate).toHaveBeenCalledTimes(1)
    expect(navigation.navigate).toHaveBeenCalledWith(PDF_VIEW_ROUTE, { url, shareUrl: url })
    expect(navigateTo).not.toHaveBeenCalled()
    expect(openExternalUrl).not.toHaveBeenCalled()
  })

  it('should navigate to image modal route for jpgs', async () => {
    const url = 'https://example.com/my.jpg'
    await renderMockComponent(url)
    expect(navigation.navigate).toHaveBeenCalledTimes(1)
    expect(navigation.navigate).toHaveBeenCalledWith(IMAGE_VIEW_ROUTE, {
      url,
      shareUrl: url,
    })
    expect(navigateTo).not.toHaveBeenCalled()
    expect(openExternalUrl).not.toHaveBeenCalled()
  })

  it('should navigate to image modal route for jpegs', async () => {
    const url = 'https://example.com/my.jpeg'
    await renderMockComponent(url)
    expect(navigation.navigate).toHaveBeenCalledTimes(1)
    expect(navigation.navigate).toHaveBeenCalledWith(IMAGE_VIEW_ROUTE, {
      url,
      shareUrl: url,
    })
    expect(navigateTo).not.toHaveBeenCalled()
    expect(openExternalUrl).not.toHaveBeenCalled()
  })

  it('should navigate to image modal route for pngs', async () => {
    const url = 'https://example.com/my.png'
    await renderMockComponent(url)
    expect(navigation.navigate).toHaveBeenCalledTimes(1)
    expect(navigation.navigate).toHaveBeenCalledWith(IMAGE_VIEW_ROUTE, {
      url,
      shareUrl: url,
    })
    expect(navigateTo).not.toHaveBeenCalled()
    expect(openExternalUrl).not.toHaveBeenCalled()
  })

  it('should call navigateTo for internal links', async () => {
    const url = 'https://integreat.app'
    await renderMockComponent(url)
    expect(navigateTo).toHaveBeenCalledTimes(1)
    expect(navigateTo).toHaveBeenCalledWith({
      route: REGIONS_ROUTE,
      languageCode,
    })
    expect(navigation.navigate).not.toHaveBeenCalled()
    expect(openExternalUrl).not.toHaveBeenCalled()
  })

  it('should call openExternalUrl for external links', async () => {
    const url = 'https://example.com'
    await renderMockComponent(url)
    expect(openExternalUrl).toHaveBeenCalledTimes(1)
    expect(openExternalUrl).toHaveBeenCalledWith(url)
    expect(navigation.navigate).not.toHaveBeenCalled()
    expect(navigateTo).not.toHaveBeenCalled()
  })
})
