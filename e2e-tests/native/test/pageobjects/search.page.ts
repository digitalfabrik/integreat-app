import { Page } from './page.js'

class SearchPage extends Page {
  constructor() {
    super('Search-Page')
  }

  get search(): ReturnType<typeof $> {
    return $('~Content-Search-Input')
  }
}

export default new SearchPage()
