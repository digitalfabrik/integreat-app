import { Routes } from '../../../shared/constants.js'
import Page from './page.js'

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LandingPage extends Page {
  get regions(): ReturnType<typeof $$> {
    return $$('//main//a')
  }

  get search(): ReturnType<typeof $> {
    return $('//main//input')
  }

  region(name: string): ReturnType<typeof $> {
    return $(`=${name}`)
  }

  open() {
    return super.open(Routes.landing)
  }
}

export default new LandingPage()
