import { Routes } from '../../../shared/constants'
import categoriesPage from '../pageobjects/categories.page'
import dashboardPage from '../pageobjects/dashboard.page'
import { getPathname } from '../utils/helpers'

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
    expect(await subCategoryEl.isDisplayed()).toBeTrue()

    const leaf = await $(`*=${leafCategory}`)
    expect(await leaf.isDisplayed()).toBeTrue()
  })

  it('should open sub category', async () => {
    await categoriesPage.openCategory(subCategory)

    const headline = await $(`h1=${subCategory}`)
    expect(await headline.isDisplayed()).toBeTrue()
  })

  it('should open leaf in category', async () => {
    await categoriesPage.openCategory(leafCategory)

    const headline = await $(`h1=${leafCategory}`)
    expect(await headline.isDisplayed()).toBeTrue()
  })

  it('should open leaf in sub category', async () => {
    await categoriesPage.openCategory(subCategory)
    await categoriesPage.openCategory(leafCategory)

    const headline = await $(`h1=${leafCategory}`)
    expect(await headline.isDisplayed()).toBeTrue()
  })
})
