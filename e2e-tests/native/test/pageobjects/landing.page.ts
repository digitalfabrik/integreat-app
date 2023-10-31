import Gestures from '../helpers/Gestures.js'
import { Selector } from '../helpers/Selector.js'
import { Page } from './page.js'

const MAX_SCROLLS = 4

class LandingPage extends Page {
  constructor() {
    super('Landing-Page')
  }

  get cities() {
    return $$('~City-Entry')
  }

  get search() {
    return $('~Search-Input')
  }

  city(name: string) {
    const selector = $(new Selector().ByText(name).build())
    return Gestures.checkIfDisplayedWithSwipeUp(selector, MAX_SCROLLS)
  }
}

export default new LandingPage()
