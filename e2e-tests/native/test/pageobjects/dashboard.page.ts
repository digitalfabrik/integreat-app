import { Page } from './page.js'

class DashboardPage extends Page {
  constructor() {
    super('Dashboard-Page')
  }

  get searchIcon() {
    return $('~Search')
  }

  get headerOverflowButton() {
    return $('~More options')
  }

  get languageIcon() {
    return $('~Change language')
  }
}

export default new DashboardPage()
