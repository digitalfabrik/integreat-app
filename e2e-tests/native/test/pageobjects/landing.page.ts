import Gestures from '../helpers/Gestures'
import { Page } from './page'

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
    return Gestures.checkIfDisplayedWithSwipeUp(name, MAX_SCROLLS)
  }
}

export default new LandingPage()
