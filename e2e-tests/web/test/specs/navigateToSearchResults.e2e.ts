import { URL } from 'url'

import { contentSearch, Routes } from '../../../shared/constants'
import DashboardPage from '../pageobjects/dashboard.page'
import SearchPage from '../pageobjects/search.page'

describe('navigateToSearchResult', () => {
  it('should open and search content', async () => {
    const searchPath = Routes.search
    await DashboardPage.open()

    const searchIcon = await DashboardPage.searchIcon
    await searchIcon.click()

    const searchUrl = await browser.getUrl()
    const parsedSearchUrl = new URL(searchUrl)
    expect(parsedSearchUrl.pathname).toBe(`/${searchPath}`)

    const searchBar = await SearchPage.search
    expect(searchBar).toExist()
    await browser.keys(contentSearch)

    const results = $$('*=Language')

    await expect(results[0]).toExist()
    await expect(results[1]).toExist()
    expect(await results[1]!.getAttribute('href')).toBe(`/${Routes.dashboard}/language/language-courses`)

    await results[0]!.click()
    const resultUrl = await browser.getUrl()
    const parsedResultUrl = new URL(resultUrl)
    expect(parsedResultUrl.pathname).toBe(`/${Routes.dashboard}/language`)
  })
})
