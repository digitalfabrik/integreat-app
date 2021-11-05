import { augsburgCity } from '../../../shared/constants'
import { Selector } from '../helpers/Selector'
import DashboardPage from '../pageobjects/dashboard.page'
import LandingPage from '../pageobjects/landing.page'
import { navigateToDashboard } from '../utils/navigationUtils'

describe('navigateToOtherCity', () => {
  it('should open a new city on location change', async () => {
    await navigateToDashboard()

    const headerOverflowButton = await DashboardPage.headerOverflowButton
    await headerOverflowButton.click()
    const changeLocationItem = await $(new Selector().ByText('Change location').build())
    await changeLocationItem.click()
    await expect(await LandingPage.exists()).toBeTruthy()

    const newCity = await LandingPage.city(augsburgCity)
    expect(newCity).toBeDefined()
    newCity.click()
    expect(await DashboardPage.exists()).toBeTruthy()

    const heading = await $(new Selector().ByText('Augsburg (Stadt)').build())
    expect(heading).toBeDefined()
  })
})
