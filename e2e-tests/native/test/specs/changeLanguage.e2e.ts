import { Selector } from '../helpers/Selector.js'
import dashboardPage from '../pageobjects/dashboard.page.js'
import { navigateToDashboard } from '../utils/navigationUtils.js'

describe('change language', () => {
  it('should display language icon', async () => {
    await navigateToDashboard()
    await dashboardPage.languageIcon.waitForDisplayed()
  })

  it('should change language', async () => {
    const englishContent = $(new Selector().byText('Welcome').build())
    await englishContent.waitForDisplayed({ timeout: 30000 })

    await dashboardPage.languageIcon.click()

    const german = $(new Selector().byText('Deutsch').build())
    await german.waitForExist({ timeout: 10000 })
    await german.click()
    await $(new Selector().byText('Willkommen').build()).waitForDisplayed({ timeout: 30000 })
  })
})
