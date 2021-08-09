import Page from './page'
import { Routes } from '../../../shared/constants'

class SearchPage extends Page {

  get search() {
    return $('//input')
  }

  open(): Promise<string> {
    return super.open(Routes.search)
  }
}

export default new SearchPage()
