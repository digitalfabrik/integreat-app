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
}

export default new DashboardPage()
