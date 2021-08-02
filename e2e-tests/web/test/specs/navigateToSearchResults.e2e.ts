import { URL } from 'url'
import { contentSearch, defaultCity, filter, language, Routes } from '../../../shared/constants'
import { navigateToDashboard } from '../utils/navigationUtils'
import DashboardPage from '../pageobjects/dashboard.page'
import SearchPage from '../pageobjects/search.page'

describe('navigateToSearchResult', () => {
  it('should open and search content', async () => {
    const searchPath = Routes.search
    await navigateToDashboard()

    const searchIcon = await DashboardPage.searchIcon
    await searchIcon.click()

    const searchUrl = await browser.getUrl()
    const parsedSearchUrl = new URL(searchUrl)
    expect(parsedSearchUrl.pathname).toContain(searchPath)

    const searchBar = await SearchPage.search
    expect(searchBar).toBeDefined()
    await browser.keys(contentSearch)

    const firstResult = await $('=Language')
    const secondResult = await $('=Language courses')

    expect(firstResult).toBeDefined()
    expect(secondResult).toBeDefined()
  })
})
