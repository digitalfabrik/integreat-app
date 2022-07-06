import lolex, { InstalledClock } from 'lolex'
import React from 'react'

import buildConfig from '../../constants/buildConfig'
import { renderWithRouter } from '../../testing/render'
import HeaderLogo from '../HeaderLogo'

describe('HeaderLogo', () => {
  const womensDayCampaign = {
    campaignAppLogo: '/campaign-app-logo.png',
    startDate: '2021-03-08T00:00:00.000Z',
    endDate: '2021-03-15T00:00:00.000Z'
  }
  const previousConfig = buildConfig()
  let config = previousConfig
  let clock: InstalledClock

  afterEach(() => {
    clock.uninstall()
    config = previousConfig
  })

  it('should show the regular header app icon if there is no campaign', () => {
    clock = lolex.install({ now: 1615374110000, toFake: [] }) // Wed Mar 10 2021 11:01:50 GMT+0000
    config.campaign = undefined
    config.icons.appLogo = '/my-regular-logo'
    const { getByAltText } = renderWithRouter(<HeaderLogo link='https://example.com' />)

    expect((getByAltText('IntegreatTestCms') as HTMLMediaElement).src).toContain(config.icons.appLogo)
  })

  it('should show the campaign logo if the current date is between start and end date', () => {
    clock = lolex.install({ now: 1615374110000, toFake: [] }) // Wed Mar 10 2021 11:01:50
    config.campaign = womensDayCampaign
    config.icons.appLogo = '/my-regular-logo'
    const { getByAltText } = renderWithRouter(<HeaderLogo link='https://example.com' />)

    expect((getByAltText('IntegreatTestCms') as HTMLMediaElement).src).toBe(
      `http://localhost${womensDayCampaign.campaignAppLogo}`
    )
  })

  it('should show the regular logo if the current date is before the start date', () => {
    clock = lolex.install({ now: 1614942686000, toFake: [] }) // Fri Mar 05 2021 11:11:26
    config.campaign = womensDayCampaign
    config.icons.appLogo = '/my-regular-logo'
    const { getByAltText } = renderWithRouter(<HeaderLogo link='https://example.com' />)

    expect((getByAltText('IntegreatTestCms') as HTMLMediaElement).src).toContain(config.icons.appLogo)
  })

  it('should show the regular logo if the current date is after the end date', () => {
    clock = lolex.install({ now: 1615806686000, toFake: [] }) // Mon Mar 15 2021 11:11:26
    config.campaign = womensDayCampaign
    config.icons.appLogo = '/my-regular-logo'
    const { getByAltText } = renderWithRouter(<HeaderLogo link='https://example.com' />)

    expect((getByAltText('IntegreatTestCms') as HTMLMediaElement).src).toContain(config.icons.appLogo)
  })
})
