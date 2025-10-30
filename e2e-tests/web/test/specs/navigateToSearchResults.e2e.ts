import { contentSearch, Routes } from '../../../shared/constants.js'
import DashboardPage from '../pageobjects/dashboard.page.js'
import SearchPage from '../pageobjects/search.page.js'

describe('navigateToSearchResult', () => {
  it('should open and search content', async () => {
    const searchPath = Routes.search
    await DashboardPage.open()
    await DashboardPage.searchIcon.click()

    await browser.waitUntil(async () => (await browser.getUrl()).includes(searchPath))

    const searchBar = SearchPage.search
    await searchBar.waitForExist()
    await searchBar.click()
    await browser.keys(contentSearch)

    const results = $$('*=Language')

    await browser.waitUntil(async () => results[1]?.isDisplayed())
    const target = results[1]!
    await target.waitForDisplayed()

    try {
      await target.click()
    } catch {
      await browser.execute(element => element.click(), target)
    }

    await browser.waitUntil(async () => (await browser.getUrl()).includes('vocational-language-course-deufoev'))
  })
})
