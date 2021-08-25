import Page from './page'
import { Routes } from '../../../shared/constants'

class DashboardPage extends Page {
  get searchIcon() {
    return $("//header//a[@aria-label='Search']")
  }

  public async openCategory(category: string) {
    return (await $(`*=${category}`)).click();
  }

  open(): Promise<string> {
    return super.open(Routes.dashboard)
  }
}

export default new DashboardPage()
