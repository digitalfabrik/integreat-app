import { Selector } from '../helpers/Selector'
import { navigateToDashboard } from '../utils/navigationUtils'

describe('navigate to leaf category', () => {
  it('should open leaf category', async () => {
    await navigateToDashboard()

    const firstLevelCategory = $(new Selector().ByText('Language').build())
    await firstLevelCategory.waitForDisplayed()
    await firstLevelCategory.click()

    const secondLevelCategory = $(new Selector().ByText('Language courses').build())
    await secondLevelCategory.waitForDisplayed()
    await secondLevelCategory.click()

    const leafCategory = $(new Selector().ByText('Integration Courses').build())
    await leafCategory.waitForDisplayed()
    await leafCategory.click()

    const leafCategoryContent = $(new Selector().ByContainedText('you will learn German').build())
    await leafCategoryContent.waitForDisplayed()
  })
})
