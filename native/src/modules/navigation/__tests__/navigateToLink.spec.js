// @flow

import createNavigationScreenPropMock from '../../../testing/createNavigationPropMock'
import navigateToLink from '../navigateToLink'
import {
  IMAGE_VIEW_MODAL_ROUTE,
  LANDING_ROUTE,
  OPEN_INTERNAL_LINK_SIGNAL_NAME,
  OPEN_MEDIA_SIGNAL_NAME,
  PDF_VIEW_MODAL_ROUTE
} from 'api-client'
import sendTrackingSignal from '../../endpoint/sendTrackingSignal'
import openExternalUrl from '../../common/openExternalUrl'

jest.mock('../../endpoint/sendTrackingSignal')
jest.mock('../../i18n/NativeLanguageDetector')
jest.mock('../../common/openExternalUrl')

describe('navigateToLink', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const navigation = createNavigationScreenPropMock()
  const languageCode = 'de'
  const navigateTo = jest.fn()
  const shareUrl = 'https://example.com/my/share/url'

  it('should navigate to pdf modal route', () => {
    const url = 'https://example.com/my.pdf'
    navigateToLink(url, navigation, languageCode, navigateTo, shareUrl)

    expect(navigation.navigate).toHaveBeenCalledTimes(1)
    expect(navigation.navigate).toHaveBeenCalledWith(PDF_VIEW_MODAL_ROUTE, { url, shareUrl })
    expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
    expect(sendTrackingSignal).toHaveBeenCalledWith({ signal: { name: OPEN_MEDIA_SIGNAL_NAME, url } })

    expect(navigateTo).not.toHaveBeenCalled()
    expect(openExternalUrl).not.toHaveBeenCalled()
  })

  it('should navigate to image modal route for jpgs', () => {
    const url = 'https://example.com/my.jpg'
    navigateToLink(url, navigation, languageCode, navigateTo, shareUrl)

    expect(navigation.navigate).toHaveBeenCalledTimes(1)
    expect(navigation.navigate).toHaveBeenCalledWith(IMAGE_VIEW_MODAL_ROUTE, { url, shareUrl })
    expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
    expect(sendTrackingSignal).toHaveBeenCalledWith({ signal: { name: OPEN_MEDIA_SIGNAL_NAME, url } })

    expect(navigateTo).not.toHaveBeenCalled()
    expect(openExternalUrl).not.toHaveBeenCalled()
  })

  it('should navigate to image modal route for pngs', () => {
    const url = 'https://example.com/my.png'
    navigateToLink(url, navigation, languageCode, navigateTo, shareUrl)

    expect(navigation.navigate).toHaveBeenCalledTimes(1)
    expect(navigation.navigate).toHaveBeenCalledWith(IMAGE_VIEW_MODAL_ROUTE, { url, shareUrl })
    expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
    expect(sendTrackingSignal).toHaveBeenCalledWith({ signal: { name: OPEN_MEDIA_SIGNAL_NAME, url } })

    expect(navigateTo).not.toHaveBeenCalled()
    expect(openExternalUrl).not.toHaveBeenCalled()
  })

  it('should call navigateTo for internal links', () => {
    const url = 'https://integreat.app'
    navigateToLink(url, navigation, languageCode, navigateTo, shareUrl)

    expect(navigateTo).toHaveBeenCalledTimes(1)
    expect(navigateTo).toHaveBeenCalledWith({ route: LANDING_ROUTE, languageCode })
    expect(sendTrackingSignal).toHaveBeenCalledTimes(1)
    expect(sendTrackingSignal).toHaveBeenCalledWith({ signal: { name: OPEN_INTERNAL_LINK_SIGNAL_NAME, url } })

    expect(navigation.navigate).not.toHaveBeenCalled()
    expect(openExternalUrl).not.toHaveBeenCalled()
  })

  it('should call openExternalUrl for external links', () => {
    const url = 'https://example.com'
    navigateToLink(url, navigation, languageCode, navigateTo, shareUrl)

    expect(openExternalUrl).toHaveBeenCalledTimes(1)
    expect(openExternalUrl).toHaveBeenCalledWith(url)

    expect(sendTrackingSignal).not.toHaveBeenCalled()
    expect(navigation.navigate).not.toHaveBeenCalled()
    expect(navigateTo).not.toHaveBeenCalled()
  })
})
