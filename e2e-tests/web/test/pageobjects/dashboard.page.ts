import Page from './page'

class DashboardPage extends Page {
  public language: string

  public constructor(language = 'en') {
    super()
    this.language = language
  }

  get searchIcon() {
    return $("//header//a[@aria-label='Search']")
  }
}

export default new DashboardPage()
