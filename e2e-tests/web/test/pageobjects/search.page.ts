import Page from './page'

class SearchPage extends Page {
  public language: string

  public constructor(language = 'en') {
    super()
    this.language = language
  }

  get search() {
    return $('//input')
  }
}

export default new SearchPage()
