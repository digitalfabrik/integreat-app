// @flow

import openExternalUrl from '../openExternalUrl'
import InAppBrowser from 'react-native-inappbrowser-reborn'
import { Linking } from 'react-native'

jest.mock('react-native-inappbrowser-reborn', () => ({
  open: jest.fn(),
  isAvailable: jest.fn(() => true)
}))

jest.mock('react-native', () => ({
  Linking: {
    canOpenURL: jest.fn(() => true),
    openURL: jest.fn()
  }
}))

describe('openExternalUrl', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should open http urls in inapp browser', async () => {
    const url = 'https://som.niceli.nk/mor/etext'
    await openExternalUrl(url)
    expect(InAppBrowser.open).toHaveBeenLastCalledWith(url, expect.anything())
    expect(Linking.openURL).not.toHaveBeenCalled()

    const url2 = 'http://som.niceli.nk/les/stext'
    await openExternalUrl(url2)
    expect(InAppBrowser.open).toHaveBeenLastCalledWith(url2, expect.anything())
    expect(Linking.openURL).not.toHaveBeenCalled()
  })

  it('should open http urls with linking if inapp browser is not available', async () => {
    const url = 'https://som.niceli.nk/mor/etext'
    // $FlowFixMe mockImplementation is not missing
    InAppBrowser.isAvailable.mockImplementation(() => false)
    await openExternalUrl(url)
    expect(InAppBrowser.open).not.toHaveBeenCalled()
    expect(Linking.openURL).toHaveBeenLastCalledWith(url)
  })

  it('should open non http urls with react native linking if possible', async () => {
    const url = 'mailto:som.enice@ma.il'
    await openExternalUrl(url)
    expect(Linking.openURL).toHaveBeenCalledWith(url)
    expect(InAppBrowser.open).not.toHaveBeenCalled()
  })

  it('should show snackbar if opening url is not supported', async () => {
    const url = 'mor:erando.mstu.ff'
    Linking.canOpenURL.mockImplementation(() => false)
    await openExternalUrl(url)
    expect(Linking.openURL).not.toHaveBeenCalled()
    expect(InAppBrowser.open).not.toHaveBeenCalled()
    // TODO IGAPP-521 assert snackbar is shown
  })
})
