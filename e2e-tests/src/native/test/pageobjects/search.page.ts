import { Page } from './page.js'

class SearchPage extends Page {
  constructor() {
    super('Search-Page')
  }

  get contentSearch(): ReturnType<typeof $> {
    return driver.isAndroid ? $('~Search content') : $('//*[@label="Search content"]')
  }

  public async get(): Promise<true | void> {
    return this.contentSearch.waitForExist({ timeout: 10000 })
  }
}

export default new SearchPage()
