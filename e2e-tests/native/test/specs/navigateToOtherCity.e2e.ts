import { augsburgCity } from '../../../shared/constants'
import { Selector } from '../helpers/Selector'
import DashboardPage from '../pageobjects/dashboard.page'
import LandingPage from '../pageobjects/landing.page'
import { navigateToDashboard } from '../utils/navigationUtils'

describe('navigate to other city', () => {
  it('should open a new city on location change', async () => {
    await navigateToDashboard()

    await DashboardPage.headerOverflowButton.click()
    await $(new Selector().ByText('Change location').build()).click()
    await expect(LandingPage.get()).toExist()

    const newCity = await LandingPage.city(augsburgCity)
    expect(newCity).toExist()
    await newCity.click()
    await expect(DashboardPage.get()).toExist()

    const heading = $(new Selector().ByText('Augsburg (Stadt)').build())
    await expect(heading).toExist()
  })
})
