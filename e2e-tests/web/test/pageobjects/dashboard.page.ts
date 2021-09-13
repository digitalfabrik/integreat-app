import { Routes } from '../../../shared/constants'
import { CategoriesPage } from './categories.page'

class DashboardPage extends CategoriesPage {
  get searchIcon() {
    return $("//header//a[@aria-label='Search']")
  }

  get locationIcon() {
    return $("//header//a[@aria-label='Change location']")
  }

  open(): Promise<string> {
    return super.open(Routes.dashboard)
  }
}

export default new DashboardPage()
