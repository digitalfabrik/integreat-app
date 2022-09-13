import { contentSearch } from '../../../shared/constants'
import { Selector } from '../helpers/Selector'
import DashboardPage from '../pageobjects/dashboard.page'
import SearchPage from '../pageobjects/search.page'
import { navigateToDashboard } from '../utils/navigationUtils'

describe('navigate to search result', () => {
  it('should open and search content', async () => {
    await navigateToDashboard()
    DashboardPage.searchIcon.click()
    await expect(SearchPage.get()).toExist()

    const searchBar = SearchPage.search
    await expect(searchBar).toExist()
    await searchBar.addValue(contentSearch)

    const searchResult = $(new Selector().ByBeginsWith('Language').build())
    await expect(searchResult).toExist()
    await searchResult.click()

    const categoryItem = $(new Selector().ByText('Language courses').build())
    await expect(categoryItem).toExist()
  })
})
