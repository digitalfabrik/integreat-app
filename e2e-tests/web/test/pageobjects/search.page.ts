import { Routes } from '../../../shared/constants'
import Page from './page'

class SearchPage extends Page {
  get search() {
    return $('//input')
  }

  open(): Promise<string> {
    return super.open(Routes.search)
  }
}

export default new SearchPage()
