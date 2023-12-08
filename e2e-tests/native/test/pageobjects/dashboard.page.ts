import { Page } from './page.js'

class DashboardPage extends Page {
  constructor() {
    super('Dashboard-Page')
  }

  get searchIcon(): ReturnType<typeof $> {
    return $('~Search')
  }

  get headerOverflowButton(): ReturnType<typeof $> {
    return $('~More options')
  }

  get languageIcon(): ReturnType<typeof $> {
    return $('~Change language')
  }
}

export default new DashboardPage()
