import { Selector } from '../Selector'
import dashboardPage from '../pageobjects/dashboard.page'
import { navigateToDashboard } from '../utils/navigationUtils'

describe('Change language', () => {
  it('should display language icon', async () => {
    await navigateToDashboard()

    const languageIcon = await dashboardPage.languageIcon
    expect(await languageIcon.isDisplayed()).toBeTrue()
  })

  it('should change language', async () => {
    const englishContent = await $(new Selector().ByText('Welcome').build())
    expect(await englishContent.isDisplayed()).toBeTrue()

    const languageIcon = await dashboardPage.languageIcon
    await languageIcon.click()

    const button = await $(new Selector().ByText('Deutsch').build())
    await button.click()

    const germanContent = await $(new Selector().ByText('Willkommen').build())
    expect(await germanContent.waitForDisplayed({ timeout: 12000 })).toBeTrue()
  })
})
