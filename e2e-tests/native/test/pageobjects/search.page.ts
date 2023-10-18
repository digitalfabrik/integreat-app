import { Page } from './page.js'

class SearchPage extends Page {
  constructor() {
    super('Search-Page')
  }

  get search() {
    return $('~Content-Search-Input')
  }
}

export default new SearchPage()
