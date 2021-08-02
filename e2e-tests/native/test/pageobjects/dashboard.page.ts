import { Page } from './page'

class DashboardPage extends Page {
  constructor() {
    super('Dashboard-Page')
  }

  get searchIcon() {
    return $('~Search')
  }
}

export default new DashboardPage()
