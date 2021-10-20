import { Routes } from '../../../shared/constants'
import { CategoriesPage } from './categories.page'

class DashboardPage extends CategoriesPage {
  get languageIcon() {
    return $("//header//button[@aria-label='Change language']")
  }

  get searchIcon() {
    return $("//header//a[@aria-label='Search']")
  }

  get locationIcon() {
    return $("//header//a[@aria-label='Change location']")
  }

  async hasHeadline(headline: string) {
    return (await $(`h1=${headline}`)).isDisplayed()
  }

  async selectLanguage(lang: string) {
    const languageIcon = await this.languageIcon
    await languageIcon.click()
    const language = await $(`*[data-testid='${lang}']`)
    await language.click()
  }

  open(): Promise<string> {
    return super.open(Routes.dashboard)
  }
}

export default new DashboardPage()
