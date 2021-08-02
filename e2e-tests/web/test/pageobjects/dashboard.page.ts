import Page from './page'

class DashboardPage extends Page {
  public language: string

  public constructor(language = 'en') {
    super()
    this.language = language
  }

  get searchIcon() {
    return $('//header/div/div[4]/div[1]/a')
  }
}

export default new DashboardPage()
