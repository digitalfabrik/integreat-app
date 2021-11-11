import { Page } from './page'

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
