import Page from './page'
import { Routes } from '../../../shared/constants'

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LandingPage extends Page {
  get cities() {
    return $$('//main//a')
  }

  get search() {
    return $('//main//input')
  }

  city(name: string) {
    return $(`*=${name}`)
  }

  open() {
    return super.open(Routes.landing)
  }
}

export default new LandingPage()
