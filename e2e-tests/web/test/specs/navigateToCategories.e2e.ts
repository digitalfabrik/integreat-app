import { Routes } from '../../../shared/constants.js'
import categoriesPage from '../pageobjects/categories.page.js'
import dashboardPage from '../pageobjects/dashboard.page.js'
import { getPathname } from '../utils/helpers.js'

describe('Categories', () => {
  const category = 'Welcome'
  const subCategory = 'Welcome to [Stadt]'
  const leafCategory = 'Community life in Germany'

  beforeEach(async () => {
    await dashboardPage.open()
    await dashboardPage.openCategory(category)
  })

  it('should open category and display sub categories', async () => {
    expect(await getPathname()).toBe(`/${Routes.dashboard}/welcome`)

    const subCategoryEl = await $(`*=${subCategory}`)
    await subCategoryEl.waitForDisplayed()
    expect(await subCategoryEl.isDisplayed()).toBeTruthy()

    const leaf = await $(`*=${leafCategory}`)
    await leaf.waitForDisplayed()
    expect(await leaf.isDisplayed()).toBeTruthy()
  })

  it('should open sub category', async () => {
    await categoriesPage.openCategory(subCategory)

    const headline = await $(`h1=${subCategory}`)
    await headline.waitForDisplayed()
    expect(await headline.isDisplayed()).toBeTruthy()
  })

  it('should open leaf in category', async () => {
    await categoriesPage.openCategory(leafCategory)

    const headline = await $(`h1=${leafCategory}`)
    await headline.waitForDisplayed()
    expect(await headline.isDisplayed()).toBeTruthy()
  })

  it('should open leaf in sub category and display the content', async () => {
    await categoriesPage.openCategory(subCategory)
    await categoriesPage.openCategory(leafCategory)

    const headline = await $(`h1=${leafCategory}`)
    await headline.waitForDisplayed()
    expect(await headline.isDisplayed()).toBeTruthy()

    const contentExcerpt = await $('li*=Everyone is allowed to have their own opinion.')
    await contentExcerpt.waitForDisplayed()
    expect(await contentExcerpt.isDisplayed()).toBeTruthy()
  })
})
