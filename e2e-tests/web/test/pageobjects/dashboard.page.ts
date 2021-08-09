import Page from './page'
import { Routes } from '../../../shared/constants'

class DashboardPage extends Page {

  get searchIcon() {
    return $("//header//a[@aria-label='Search']")
  }

  open(): Promise<string> {
    return super.open(Routes.dashboard)
  }
}

export default new DashboardPage()
