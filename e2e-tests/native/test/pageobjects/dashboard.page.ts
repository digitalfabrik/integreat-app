import { Page } from './page.js'

class DashboardPage extends Page {
  constructor() {
    super('Dashboard-Page')
  }

  get searchIcon(): ChainablePromiseElement {
    return $('~Search')
  }

  get headerOverflowButton(): ChainablePromiseElement {
    return $('~More options')
  }

  get languageIcon(): ChainablePromiseElement {
    return $('~Change language')
  }
}

export default new DashboardPage()
