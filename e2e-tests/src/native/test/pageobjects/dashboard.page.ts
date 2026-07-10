import { Page } from './page.js'

class DashboardPage extends Page {
  constructor() {
    super('Dashboard-Page')
  }

  get searchIcon(): ReturnType<typeof $> {
    return driver.isAndroid ? $('~Search') : $('//*[@label="Search"]')
  }

  get settintgsIcon(): ReturnType<typeof $> {
    return driver.isAndroid ? $('~Settings') : $('//*[@label="Settings"]')
  }

  get languageIcon(): ReturnType<typeof $> {
    return driver.isAndroid ? $('~Change language') : $('//*[@label="Change language"]')
  }
}

export default new DashboardPage()
