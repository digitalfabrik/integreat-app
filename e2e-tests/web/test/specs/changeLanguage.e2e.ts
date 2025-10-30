import dashboardPage from '../pageobjects/dashboard.page.js'

describe('change language', () => {
  beforeEach(async () => {
    await dashboardPage.open()
  })

  it('should display language icon', async () => {
    await browser.waitUntil(async () => dashboardPage.languageIcon.isDisplayed())
    expect(await dashboardPage.languageIcon.isDisplayed()).toBeTruthy()
  })

  it('should open language selector', async () => {
    await dashboardPage.languageIcon.waitForClickable({ timeout: 2000 })
    await dashboardPage.languageIcon.click()

    const languageSelector = await $("*[data-testid='headerActionItemDropDown']")
    await browser.waitUntil(async () => (await languageSelector.getCSSProperty('visibility')).value === 'visible', {
      timeout: 2000,
    })

    expect((await languageSelector.getCSSProperty('visibility')).value).toBe('visible')
    expect(await languageSelector.isDisplayed()).toBeTruthy()
  })

  it('should change language', async () => {
    await $('h1').waitForDisplayed()
    expect(await dashboardPage.hasHeadline('Local information')).toBeTruthy()

    const englishContent = await $(`*=Welcome`)
    await englishContent.waitForDisplayed({ timeout: 10000 })
    expect(await englishContent.isDisplayed()).toBeTruthy()

    await dashboardPage.selectLanguage('Deutsch')
    await browser.waitUntil(async () => dashboardPage.hasHeadline('Lokale Informationen'))

    expect(await dashboardPage.hasHeadline('Lokale Informationen')).toBeTruthy()
    const germanContent = await $(`*=Willkommen`)
    await germanContent.waitForDisplayed()
    expect(await germanContent.isDisplayed()).toBeTruthy()
  })
})
