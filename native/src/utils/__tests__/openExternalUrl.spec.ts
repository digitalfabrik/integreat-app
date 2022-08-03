import { mocked } from 'jest-mock'
import { Linking } from 'react-native'
import InAppBrowser from 'react-native-inappbrowser-reborn'

import { NotFoundError, OPEN_EXTERNAL_LINK_SIGNAL_NAME, OPEN_OS_LINK_SIGNAL_NAME } from 'api-client'

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
  it('should open http urls in inapp browser', async () => {
    const url = 'https://som.niceli.nk/mor/etext'
    await openExternalUrl(url)
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
    await openExternalUrl(url2)
    expect(InAppBrowser.close).toHaveBeenCalled()
    expect(InAppBrowser.open).toHaveBeenLastCalledWith(url2, expect.anything())
    expect(Linking.openURL).not.toHaveBeenCalled()
    expect(sendTrackingSignal).toHaveBeenCalledWith({
      signal: {
        name: OPEN_EXTERNAL_LINK_SIGNAL_NAME,
        url: url2,
      },
    })
  })
  it('should open http urls with linking if inapp browser is not available', async () => {
    const url = 'https://som.niceli.nk/mor/etext'
    mocked(InAppBrowser.isAvailable).mockImplementation(async () => false)
    await openExternalUrl(url)
    expect(InAppBrowser.open).not.toHaveBeenCalled()
    expect(Linking.openURL).toHaveBeenLastCalledWith(url)
  })
  it('should open non http urls with react native linking if possible', async () => {
    const url = 'mailto:som.enice@ma.il'
    await openExternalUrl(url)
    expect(Linking.openURL).toHaveBeenCalledWith(url)
    expect(InAppBrowser.open).not.toHaveBeenCalled()
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
    await expect(openExternalUrl(url)).rejects.toThrow(
      new NotFoundError({
        type: 'route',
        id: url,
        city: '',
        language: '',
      })
    )
    expect(Linking.openURL).not.toHaveBeenCalled()
    expect(InAppBrowser.open).not.toHaveBeenCalled()
  })
})
