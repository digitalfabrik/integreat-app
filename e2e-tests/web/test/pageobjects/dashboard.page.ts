import { CategoriesPage } from './categories.page'
import { Routes } from '../../../shared/constants'

class DashboardPage extends CategoriesPage {
  get searchIcon() {
    return $("//header//a[@aria-label='Search']")
  }

  open(): Promise<string> {
    return super.open(Routes.dashboard)
  }
}

export default new DashboardPage()
