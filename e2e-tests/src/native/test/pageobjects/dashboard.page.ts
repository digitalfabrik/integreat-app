import { Selector } from '../helpers/Selector.js'
import { identifyByLabel } from '../helpers/identifyByLabel.js'
import { Page } from './page.js'

class DashboardPage extends Page {
  get searchIcon(): ReturnType<typeof $> {
    return identifyByLabel('Search')
  }

  get settingsIcon(): ReturnType<typeof $> {
    return identifyByLabel('Settings')
  }

  get languageIcon(): ReturnType<typeof $> {
    return identifyByLabel('Change language')
  }

  get welcomeText() {
    return $(new Selector().byText('Welcome').build())
  }

  get willkommenText() {
    return $(new Selector().byText('Willkommen').build())
  }

  async get(): Promise<void> {
    try {
      await this.welcomeText.waitForDisplayed({ timeout: 40000 })
    } catch {
      await this.willkommenText.waitForDisplayed({ timeout: 40000 })
    }
  }
}

export default new DashboardPage()
