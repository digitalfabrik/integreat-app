import { Selector } from '../helpers/Selector.js'
import dashboardPage from '../pageobjects/dashboard.page.js'
import { navigateToDashboard } from '../utils/navigationUtils.js'

describe('change language', () => {
  it('should display language icon', async () => {
    await navigateToDashboard()

    dashboardPage.languageIcon.waitForDisplayed()
  })

  it('should change language', async () => {
    const englishContent = $(new Selector().ByText('Welcome').build())
    await englishContent.waitForDisplayed()

    await dashboardPage.languageIcon.click()

    await $(new Selector().ByText('Deutsch').build()).click()

    await (
      await $(new Selector().ByContainedText('Loading').build())
    ).waitForDisplayed({ timeout: 30000, interval: 2000, reverse: true })

    await $(new Selector().ByText('Willkommen').build()).waitForDisplayed()
  })
})
