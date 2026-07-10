import Gestures from '../helpers/Gestures.js'
import { Selector } from '../helpers/Selector.js'
import { identifyByLabel } from '../helpers/identifyByLabel.js'
import { Page } from './page.js'

const MAX_SCROLLS = 4

class RegionsPage extends Page {
  get search(): ReturnType<typeof $> {
    return identifyByLabel('Search region')
  }

  async get(): Promise<void> {
    await this.search.waitForDisplayed({ timeout: 40000 })
  }

  region(name: string) {
    const selector = $(new Selector().byText(name).build())
    return Gestures.checkIfDisplayedWithSwipeUp(selector, MAX_SCROLLS)
  }
}

export default new RegionsPage()
