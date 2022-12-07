import React from 'react'

import buildConfig from '../../constants/buildConfig'
import { renderWithRouter } from '../../testing/render'
import HeaderLogo from '../HeaderLogo'

jest.useFakeTimers()
describe('HeaderLogo', () => {
  const womensDayCampaign = {
    campaignAppLogo: '/campaign-app-logo.png',
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
    const { getByAltText } = renderWithRouter(<HeaderLogo link='https://example.com' />)

    expect((getByAltText('IntegreatTestCms') as HTMLMediaElement).src).toContain(config.icons.appLogo)
  })

  it('should show the campaign logo if the current date is between start and end date', () => {
    jest.setSystemTime(1615374110000) // Wed Mar 10 2021 11:01:50 GMT+0000
    config.campaign = womensDayCampaign
    config.icons.appLogo = '/my-regular-logo'
    const { getByAltText } = renderWithRouter(<HeaderLogo link='https://example.com' />)

    expect((getByAltText('IntegreatTestCms') as HTMLMediaElement).src).toBe(
      `http://localhost${womensDayCampaign.campaignAppLogo}`
    )
  })

  it('should show the regular logo if the current date is before the start date', () => {
    jest.setSystemTime(1614942686000)// Fri Mar 05 2021 11:11:26
    config.campaign = womensDayCampaign
    config.icons.appLogo = '/my-regular-logo'
    const { getByAltText } = renderWithRouter(<HeaderLogo link='https://example.com' />)

    expect((getByAltText('IntegreatTestCms') as HTMLMediaElement).src).toContain(config.icons.appLogo)
  })

  it('should show the regular logo if the current date is after the end date', () => {
    jest.setSystemTime(1615806686000) // Mon Mar 15 2021 11:11:26
    config.campaign = womensDayCampaign
    config.icons.appLogo = '/my-regular-logo'
    const { getByAltText } = renderWithRouter(<HeaderLogo link='https://example.com' />)

    expect((getByAltText('IntegreatTestCms') as HTMLMediaElement).src).toContain(config.icons.appLogo)
  })
})
