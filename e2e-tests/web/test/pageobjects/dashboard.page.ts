import { Routes } from '../../../shared/constants.js'
import { CategoriesPage } from './categories.page.js'

class DashboardPage extends CategoriesPage {
  get languageIcon(): ReturnType<typeof $> {
    return $("//header//button[@aria-label='Change language']")
  }

  get searchIcon(): ReturnType<typeof $> {
    return $("//header//a[@aria-label='Search']")
  }

  get locationIcon(): ReturnType<typeof $> {
    return $("//header//a[@aria-label='Change location']")
  }

  async hasHeadline(headline: string) {
    return (await $(`h1=${headline}`)).isDisplayed()
  }

  async selectLanguage(lang: string) {
    const languageIcon = await this.languageIcon
    await languageIcon.click()
    const language = await $(`=${lang}`)
    await language.click()
  }

  open(): Promise<string> {
    return super.open(Routes.dashboard)
  }
}

export default new DashboardPage()
