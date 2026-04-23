import Gestures from '../helpers/Gestures.js'
import { Selector } from '../helpers/Selector.js'
import { Page } from './page.js'

const MAX_SCROLLS = 4

class LandingPage extends Page {
  constructor() {
    super('Landing-Page')
  }

  get regions(): ReturnType<typeof $$> {
    return $$('~Region-Entry')
  }

  get search(): ReturnType<typeof $> {
    return $('~Search-Input')
  }

  region(name: string) {
    const selector = $(new Selector().ByText(name).build())
    return Gestures.checkIfDisplayedWithSwipeUp(selector, MAX_SCROLLS)
  }
}

export default new LandingPage()
