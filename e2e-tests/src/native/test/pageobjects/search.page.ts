import { identifyByLabel } from '../helpers/identifyByLabel.js'
import { Page } from './page.js'

class SearchPage extends Page {
  get contentSearch(): ReturnType<typeof $> {
    return identifyByLabel('Search content')
  }

  async get(): Promise<void> {
    await this.contentSearch.waitForExist({ timeout: 10000 })
  }
}

export default new SearchPage()
