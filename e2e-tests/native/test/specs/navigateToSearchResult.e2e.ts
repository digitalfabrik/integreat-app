import { contentSearch } from '../../../shared/constants'
import { Selector } from '../helpers/Selector'
import DashboardPage from '../pageobjects/dashboard.page'
import SearchPage from '../pageobjects/search.page'
import { navigateToDashboard } from '../utils/navigationUtils'

describe('navigate to search result', () => {
  it('should open and search content', async () => {
    await navigateToDashboard()
    await DashboardPage.searchIcon.click()
    await SearchPage.get()

    const searchBar = await SearchPage.search
    await searchBar.addValue(contentSearch)

    const searchResult = await $(new Selector().ByBeginsWith('Language').build())
    await searchResult.click()

    await $(new Selector().ByText('Language courses').build()).waitForDisplayed()
  })
})
