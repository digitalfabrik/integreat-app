import dashboardPage from '../pageobjects/dashboard.page'

describe('Change language', () => {
  beforeEach(async () => {
    await dashboardPage.open()
  })

  it('should display language icon', async () => {
    const icon = await dashboardPage.languageIcon
    expect(await icon.isDisplayed()).toBeTrue()
  })

  it('should change language', async () => {
    expect(await dashboardPage.hasHeadline('Local information')).toBeTrue()
    const englishContent = await $(`*=Welcome`)
    expect(await englishContent.isDisplayed()).toBeTrue()

    await dashboardPage.selectLanguage('Deutsch')

    expect(await dashboardPage.hasHeadline('Lokale Informationen')).toBeTrue()
    const germanContent = await $(`*=Willkommen`)
    expect(await germanContent.isDisplayed()).toBeTrue()
  })
})
