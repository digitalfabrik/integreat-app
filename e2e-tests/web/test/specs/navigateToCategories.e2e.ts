import { Routes } from '../../../shared/constants'
import CategoriesPage from '../pageobjects/categories.page'
import DashboardPage from '../pageobjects/dashboard.page'
import { getUrl } from '../utils/helpers'

describe('Categories', () => {
  beforeEach(async () => {
    await DashboardPage.open()
    await DashboardPage.openCategory('Welcome')
  })

  it('should open category "Welcome" and display sub categories', async () => {
    expect(await getUrl()).toBe(`/${Routes.dashboard}/welcome`)

    const subCategory = await $(`*=Welcome to [Stadt]`)
    expect(await subCategory.isDisplayed()).toBeTrue()

    const leaf = await $(`*=Community life in Germany`)
    expect(await leaf.isDisplayed()).toBeTrue()
  })

  it('Should open sub category "Welcome to [Stadt]"', async () => {
    await CategoriesPage.openCategory('Welcome to [Stadt]')

    const headline = await $('h1=Welcome to [Stadt]')
    expect(await headline.isDisplayed()).toBeTrue()
  })

  it('Should open leaf "Community life" in category "Welcome"', async () => {
    await CategoriesPage.openCategory('Community life in Germany')

    const headline = await $('h1=Community life in Germany')
    expect(await headline.isDisplayed()).toBeTrue()
  })

  it('Should open leaf "Community life" in sub category "Welcome to [Stadt]"', async () => {
    await CategoriesPage.openCategory('Welcome to [Stadt]')
    await CategoriesPage.openCategory('Community life in Germany')

    const headline = await $('h1=Community life in Germany')
    expect(await headline.isDisplayed()).toBeTrue()
  })
})
