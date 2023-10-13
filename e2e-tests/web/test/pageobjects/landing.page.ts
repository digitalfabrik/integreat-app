import { Routes } from '../../../shared/constants.js'
import Page from './page.js'

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LandingPage extends Page {
  get cities(): ReturnType<typeof $$> {
    return $$('//main//a')
  }

  get search(): ChainablePromiseElement {
    return $('//main//input')
  }

  city(name: string): ChainablePromiseElement {
    return $(`=${name}`)
  }

  open() {
    return super.open(Routes.landing)
  }
}

export default new LandingPage()
