import { Page } from './page.js'

class SearchPage extends Page {
  constructor() {
    super('Search-Page')
  }

  get contentSearch(): ReturnType<typeof $> {
    return $('~Search content')
  }
}

export default new SearchPage()
