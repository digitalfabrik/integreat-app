import { contentSearch } from '../../../shared/constants.js'
import { Selector } from '../helpers/Selector.js'
import DashboardPage from '../pageobjects/dashboard.page.js'
import SearchPage from '../pageobjects/search.page.js'
import { navigateToDashboard } from '../utils/navigationUtils.js'

describe('navigate to search result', () => {
  it('should open and search content', async () => {
    await navigateToDashboard()
    await DashboardPage.searchIcon.waitForDisplayed({ timeout: 20000 })
    await DashboardPage.searchIcon.click()
    await SearchPage.get()

    const searchBar = await SearchPage.search
    await searchBar.addValue(contentSearch)

    const searchResult = $(new Selector().ByBeginsWith('Language').build())
    await searchResult.waitForDisplayed({ timeout: 20000 })
    await searchResult.click()

    await $(new Selector().ByText('Language courses').build()).waitForDisplayed()
  })
})
