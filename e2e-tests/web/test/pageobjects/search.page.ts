import { Routes } from '../../../shared/constants.js'
import Page from './page.js'

class SearchPage extends Page {
  get search() {
    return $('//input')
  }

  open(): Promise<string> {
    return super.open(Routes.search)
  }
}

export default new SearchPage()
