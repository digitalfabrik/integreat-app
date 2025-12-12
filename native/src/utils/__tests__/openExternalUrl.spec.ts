import { mocked } from 'jest-mock'
import { Linking } from 'react-native'
import InAppBrowser from 'react-native-inappbrowser-reborn'

import { OPEN_EXTERNAL_LINK_SIGNAL_NAME, OPEN_OS_LINK_SIGNAL_NAME } from 'shared'

import openExternalUrl from '../openExternalUrl'
import sendTrackingSignal from '../sendTrackingSignal'

jest.mock('@sentry/react-native', () => ({
  captureException: () => undefined,
}))
jest.mock('react-native-inappbrowser-reborn', () => ({
  open: jest.fn(),
  close: jest.fn(),
  isAvailable: jest.fn(() => true),
}))
jest.mock('../../utils/sendTrackingSignal')
jest.mock('react-native', () => ({
  Linking: {
    canOpenURL: jest.fn(() => true),
    openURL: jest.fn(),
  },
}))

describe('openExternalUrl', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const showSnackbar = jest.fn()

  it('should open https urls in inapp browser', async () => {
    const url = 'https://som.niceli.nk/mor/etext'
    await openExternalUrl(url, showSnackbar)
    expect(InAppBrowser.close).toHaveBeenCalled()
    expect(InAppBrowser.open).toHaveBeenLastCalledWith(url, expect.anything())
    expect(Linking.openURL).not.toHaveBeenCalled()
    expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: {
        name: OPEN_EXTERNAL_LINK_SIGNAL_NAME,
        url,
      },
    })
    const url2 = 'http://som.niceli.nk/les/stext'
    await openExternalUrl(url2, showSnackbar)
    expect(InAppBrowser.close).toHaveBeenCalled()
    expect(InAppBrowser.open).toHaveBeenLastCalledWith(url2, expect.anything())
    expect(Linking.openURL).not.toHaveBeenCalled()
    expect(showSnackbar).not.toHaveBeenCalled()
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: {
        name: OPEN_EXTERNAL_LINK_SIGNAL_NAME,
        url: url2,
      },
    })
  })

  it('should encode urls before opening them', async () => {
    const rawUrl = 'https://kein.schö.ner/Link/zum/öffnen'
    const encodedUrl = encodeURI(rawUrl)
    await openExternalUrl(rawUrl, showSnackbar)
    expect(InAppBrowser.close).toHaveBeenCalled()
    expect(InAppBrowser.open).toHaveBeenLastCalledWith(encodedUrl, expect.anything())
    expect(Linking.openURL).not.toHaveBeenCalled()
    expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: {
        name: OPEN_EXTERNAL_LINK_SIGNAL_NAME,
        url: encodedUrl,
      },
    })
  })

  it('should open https urls with linking if inapp browser is not available', async () => {
    const url = 'https://som.niceli.nk/mor/etext'
    mocked(InAppBrowser.isAvailable).mockImplementation(async () => false)
    await openExternalUrl(url, showSnackbar)
    expect(InAppBrowser.open).not.toHaveBeenCalled()
    expect(showSnackbar).not.toHaveBeenCalled()
    expect(Linking.openURL).toHaveBeenLastCalledWith(url)
  })

  it('should open internal links with http protocol in inapp browser', async () => {
    const url = 'https://integreat.app/testumgebung/ar'
    mocked(InAppBrowser.isAvailable).mockImplementation(async () => true)
    await openExternalUrl(url, showSnackbar)
    expect(InAppBrowser.open).toHaveBeenCalledTimes(1)
    expect(InAppBrowser.open).toHaveBeenCalledWith('http://integreat.app/testumgebung/ar', expect.anything())
    expect(Linking.openURL).not.toHaveBeenCalled()
    expect(showSnackbar).not.toHaveBeenCalled()
  })

  it('should not encode already encoded urls', async () => {
    const url =
      'https://example.com/Dienstleistungen/index.php?ModID=10&object=tx%2C3406.2.1&La=1&NavID=3406.2.1&ort=&FID=3406.175.1'
    mocked(InAppBrowser.isAvailable).mockImplementation(async () => false)
    await openExternalUrl(url, showSnackbar)
    expect(InAppBrowser.open).not.toHaveBeenCalled()
    expect(showSnackbar).not.toHaveBeenCalled()
    expect(Linking.openURL).toHaveBeenLastCalledWith(
      'https://example.com/Dienstleistungen/index.php?ModID=10&object=tx,3406.2.1&La=1&NavID=3406.2.1&ort=&FID=3406.175.1',
    )
  })

  it('should show snackbar for internal urls if inapp browser is not available', async () => {
    const url = 'https://integreat.app'
    mocked(InAppBrowser.isAvailable).mockImplementation(async () => false)
    await openExternalUrl(url, showSnackbar)
    expect(InAppBrowser.open).not.toHaveBeenCalled()
    expect(Linking.openURL).not.toHaveBeenCalled()
    expect(showSnackbar).toHaveBeenCalled()
  })

  it('should open non http urls with react native linking if possible', async () => {
    const url = 'mailto:som.enice@ma.il'
    await openExternalUrl(url, showSnackbar)
    expect(Linking.openURL).toHaveBeenCalledWith(url)
    expect(InAppBrowser.open).not.toHaveBeenCalled()
    expect(showSnackbar).not.toHaveBeenCalled()
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: {
        name: OPEN_OS_LINK_SIGNAL_NAME,
        url,
      },
    })
  })

  it('should show snackbar if opening url is not supported', async () => {
    const url = 'mor:erando.mstu.ff'
    mocked(Linking.canOpenURL).mockImplementation(async () => false)
    await openExternalUrl(url, showSnackbar)

    expect(showSnackbar).toHaveBeenCalledTimes(1)
    expect(showSnackbar).toHaveBeenCalledWith({ text: 'noSuitableAppInstalled' })

    expect(Linking.openURL).not.toHaveBeenCalled()
    expect(InAppBrowser.open).not.toHaveBeenCalled()
  })
})
