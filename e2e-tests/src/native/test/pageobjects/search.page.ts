import { Page } from './page.js'

class SearchPage extends Page {
  constructor() {
    super('Search-Page')
  }

  get contentSearch(): ReturnType<typeof $> {
    return $('~Search content')
  }

  public async get(): Promise<true | void> {
    return $('~Search content').waitForExist({ timeout: 10000 })
  }
}

export default new SearchPage()
