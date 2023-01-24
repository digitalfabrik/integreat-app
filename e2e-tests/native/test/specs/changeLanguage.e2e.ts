import { Selector } from '../helpers/Selector'
import dashboardPage from '../pageobjects/dashboard.page'
import { navigateToDashboard } from '../utils/navigationUtils'

describe('Change language', () => {
  it('should display language icon', async () => {
    await navigateToDashboard()

    const languageIcon = dashboardPage.languageIcon
    expect(await languageIcon.isDisplayed()).toBeTruthy()
  })

  it('should change language', async () => {
    const englishContent = $(new Selector().ByText('Welcome').build())
    expect(await englishContent.isDisplayed()).toBeTruthy()

    await dashboardPage.languageIcon.click()

    await $(new Selector().ByText('Deutsch').build()).click()

    await driver.waitUntil(
      async () => {
        const loading = await $(new Selector().ByContainedText('Loading').build())
        return !!loading.error // if there was an error the element wasn't found and loading is finished
      },
      { timeout: 30000, interval: 2000 }
    )

    const germanContent = $(new Selector().ByText('Willkommen').build())
    await expect(germanContent).toExist()
  })
})
