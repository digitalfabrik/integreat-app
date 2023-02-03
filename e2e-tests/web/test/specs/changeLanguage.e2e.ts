import dashboardPage from '../pageobjects/dashboard.page'

describe('change language', () => {
  beforeEach(async () => {
    await dashboardPage.open()
  })

  it('should display language icon', async () => {
    const icon = await dashboardPage.languageIcon
    expect(await icon.isDisplayed()).toBeTruthy()
  })

  it('should open language selector', async () => {
    const languageIcon = await dashboardPage.languageIcon
    await languageIcon.click()

    const languageSelector = await $("*[data-testid='headerActionItemDropDown']")
    expect(await languageSelector.isDisplayed()).toBeTruthy()
  })

  it('should change language', async () => {
    expect(await dashboardPage.hasHeadline('Local information')).toBeTruthy()
    const englishContent = await $(`*=Welcome`)
    expect(await englishContent.isDisplayed()).toBeTruthy()

    await dashboardPage.selectLanguage('de')

    expect(await dashboardPage.hasHeadline('Lokale Informationen')).toBeTruthy()
    const germanContent = await $(`*=Willkommen`)
    expect(await germanContent.isDisplayed()).toBeTruthy()
  })
})
