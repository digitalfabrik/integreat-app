import { defaultCity, filter, language, Routes } from '../../../shared/constants'
import LandingPage from '../pageobjects/landing.page'
import { URL } from 'url'

export const navigateToDashboard = async () => {
  const dashboardPath = Routes.dashboard
  LandingPage.language = language
  await LandingPage.open()

  const search = await LandingPage.search
  await search.click()
  await browser.keys(filter)

  const filteredCity = await LandingPage.city(defaultCity)
  await filteredCity.click()

  const dashboardUrl = await browser.getUrl()
  const parsedDashboardUrl = new URL(dashboardUrl)

  expect(parsedDashboardUrl.pathname).toBe(dashboardPath)
}
