import { navigateToDashboard } from '../utils/navigationUtils'
import { Selector } from '../Selector'

describe('navigateToLeafCategory', () => {
  it('should open leaf category', async () => {
    await navigateToDashboard()

    const firstLevelCategory = await $(new Selector().ByText('Language').build())
    expect(firstLevelCategory).toBeDefined()
    await firstLevelCategory.click()

    const secondLevelCategory = await $(new Selector().ByText('Language courses').build())
    expect(secondLevelCategory).toBeDefined()
    await secondLevelCategory.click()

    const leafCategory = await $(new Selector().ByText('Integration Courses').build())
    expect(leafCategory).toBeDefined()
    await leafCategory.click()

    const leafCategoryContent = await $(
      new Selector().ByText('In the general integration course you will learn').build()
    )
    expect(leafCategoryContent).toBeDefined()
  })
})
