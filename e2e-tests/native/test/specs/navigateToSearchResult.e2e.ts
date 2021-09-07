import { contentSearch } from '../../../shared/constants'
import { Selector } from '../Selector'
import DashboardPage from '../pageobjects/dashboard.page'
import SearchPage from '../pageobjects/search.page'
import { navigateToDashboard } from '../utils/navigationUtils'

describe('navigateToSearchResult', () => {
  it('should open and search content', async () => {
    await navigateToDashboard()
    const searchIcon = await DashboardPage.searchIcon
    await searchIcon.click()
    await expect(await SearchPage.exists()).toBeTruthy()

    const searchBar = await SearchPage.search
    expect(searchBar).toBeDefined()
    await searchBar.addValue(contentSearch)

    const searchResult = await $(new Selector().ByText('Language').build())
    expect(searchResult).toBeDefined()
    await searchResult.click()

    const categoryItem = await $(new Selector().ByText('Language courses').build())
    expect(categoryItem).toBeTruthy()
  })
})
