import LandingPage from '../pageobjects/landing.page'
import { defaultCity, filter } from '../../../shared/constants'
import { hideKeyboard, swipe, SwipeDirection } from '../Action'
import DashboardPage from '../pageobjects/dashboard.page'

export const navigateToDashboard = async (): Promise<void> => {
  expect(await LandingPage.exists()).toBeTruthy()
  const search = await LandingPage.search
  await search.click()
  await search.addValue(filter)
  await hideKeyboard()
  await swipe(SwipeDirection.Down)
  const filteredCity = await LandingPage.city(defaultCity)
  await filteredCity.click()
  expect(await DashboardPage.exists()).toBeTruthy()
}
