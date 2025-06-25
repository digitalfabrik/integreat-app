import React from 'react'

import buildConfig from '../../constants/buildConfig'
import { renderWithRouterAndTheme } from '../../testing/render'
import HeaderLogo from '../HeaderLogo'

jest.mock('../base/Icon', () => ({
  __esModule: true,
  default: ({ src, title, id }: { src: string; title?: string; id?: string }) => (
    <div data-testid={id || 'header-logo'} data-src={src} data-title={title} />
  ),
}))

jest.useFakeTimers()
describe('HeaderLogo', () => {
  const womensDayCampaign = {
    campaignAppLogo: '/campaign-app-logo.png',
    campaignAppLogoMobile: '/campaign-app-logo-mobile.png',
    startDate: '2021-03-08T00:00:00.000Z',
    endDate: '2021-03-15T00:00:00.000Z',
  }
  const previousConfig = buildConfig()
  let config = previousConfig

  afterEach(() => {
    config = previousConfig
  })

  it('should show the regular header app icon if there is no campaign', () => {
    jest.setSystemTime(1615374110000) // Wed Mar 10 2021 11:01:50 GMT+0000
    config.campaign = undefined
    config.icons.appLogo = '/my-regular-logo'
    const { getByTestId } = renderWithRouterAndTheme(<HeaderLogo link='https://example.com' />)
    const logo = getByTestId('header-logo')

    expect(logo).toBeInTheDocument()
    expect(logo.getAttribute('data-src')).toBe(config.icons.appLogo)
    expect(logo.getAttribute('data-title')).toBe('IntegreatTestCms')
  })

  it('should show the campaign logo if the current date is between start and end date', () => {
    jest.setSystemTime(1615374110000) // Wed Mar 10 2021 11:01:50 GMT+0000
    config.campaign = womensDayCampaign
    config.icons.appLogo = '/my-regular-logo'
    const { getByTestId } = renderWithRouterAndTheme(<HeaderLogo link='https://example.com' />)
    const logo = getByTestId('header-logo')

    expect(logo).toBeInTheDocument()
    expect(logo.getAttribute('data-src')).toBe(womensDayCampaign.campaignAppLogo)
    expect(logo.getAttribute('data-title')).toBe('IntegreatTestCms')
  })

  it('should show the regular logo if the current date is before the start date', () => {
    jest.setSystemTime(1614942686000) // Fri Mar 05 2021 11:11:26
    config.campaign = womensDayCampaign
    config.icons.appLogo = '/my-regular-logo'
    const { getByTestId } = renderWithRouterAndTheme(<HeaderLogo link='https://example.com' />)
    const logo = getByTestId('header-logo')

    expect(logo.getAttribute('data-src')).toBe(config.icons.appLogo)
  })

  it('should show the regular logo if the current date is after the end date', () => {
    jest.setSystemTime(1615806686000) // Mon Mar 15 2021 11:11:26
    config.campaign = womensDayCampaign
    config.icons.appLogo = '/my-regular-logo'
    const { getByTestId } = renderWithRouterAndTheme(<HeaderLogo link='https://example.com' />)
    const logo = getByTestId('header-logo')

    expect(logo.getAttribute('data-src')).toBe(config.icons.appLogo)
  })
})
