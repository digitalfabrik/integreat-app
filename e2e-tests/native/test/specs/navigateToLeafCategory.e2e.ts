import { Selector } from '../helpers/Selector.js'
import { navigateToDashboard } from '../utils/navigationUtils.js'

describe('navigate to leaf category', () => {
  it('should open leaf category', async () => {
    await navigateToDashboard()

    const firstLevelCategory = $(new Selector().byText('Language').build())
    await firstLevelCategory.waitForDisplayed()
    await firstLevelCategory.click()

    const secondLevelCategory = $(new Selector().byText('Language courses').build())
    await secondLevelCategory.waitForDisplayed()
    await secondLevelCategory.click()

    const leafCategory = $(new Selector().byText('Integration Courses').build())
    await leafCategory.waitForDisplayed()
    await leafCategory.click()

    const leafCategoryContent = $(new Selector().byContainedText('you will learn German').build())
    await leafCategoryContent.waitForDisplayed({ timeout: 20000 })
    expect(await leafCategoryContent.isDisplayed()).toBeTruthy()
  })
})
