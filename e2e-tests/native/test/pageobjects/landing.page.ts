import { Selector } from '../helpers/Selector'
import { Page } from './page'

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
    return $(new Selector().ByText(name).build())
  }
}

export default new LandingPage()
