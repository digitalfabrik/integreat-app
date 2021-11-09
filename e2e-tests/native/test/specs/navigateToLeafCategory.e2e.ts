import { Selector } from '../helpers/Selector'
import { navigateToDashboard } from '../utils/navigationUtils'

describe('navigateToLeafCategory', () => {
  it('should open leaf category', async () => {
    await navigateToDashboard()

    const firstLevelCategory = $(new Selector().ByText('Language').build())
    await expect(firstLevelCategory).toExist()
    await firstLevelCategory.click()

    const secondLevelCategory = $(new Selector().ByText('Language courses').build())
    await expect(secondLevelCategory).toExist()
    await secondLevelCategory.click()

    const leafCategory = $(new Selector().ByText('Integration Courses').build())
    await expect(leafCategory).toExist()
    await leafCategory.click()

    const leafCategoryContent = $(new Selector().ByPartialText('you will learn German').build())
    await expect(leafCategoryContent).toExist()
  })
})
