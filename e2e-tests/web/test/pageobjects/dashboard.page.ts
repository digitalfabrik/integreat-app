import { Routes } from '../../../shared/constants.js'
import { CategoriesPage } from './categories.page.js'

class DashboardPage extends CategoriesPage {
  get languageIcon(): ChainablePromiseElement {
    return $("//header//button[@aria-label='Change language']")
  }

  get searchIcon(): ChainablePromiseElement {
    return $("//header//a[@aria-label='Search']")
  }

  get locationIcon(): ChainablePromiseElement {
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
