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
    await browser.setWindowSize(1440, 900)
    await dashboardPage.languageIcon.waitForClickable({ timeout: 2000 })
    await dashboardPage.languageIcon.click()

    const languageSelector = await $("*[data-testid='languageList']")
    await browser.waitUntil(async () => (await languageSelector.getCSSProperty('visibility')).value === 'visible', {
      timeout: 2000,
    })

    expect((await languageSelector.getCSSProperty('visibility')).value).toBe('visible')
    expect(await languageSelector.isDisplayed()).toBeTruthy()
  })

  it('should change language', async () => {
    const englishHeadline = await $(`h1=Local information`)
    await englishHeadline.waitForDisplayed()
    expect(await englishHeadline.isDisplayed()).toBeTruthy()

    const englishContent = await $(`*=Welcome`)
    await englishContent.waitForDisplayed({ timeout: 10000 })
    expect(await englishContent.isDisplayed()).toBeTruthy()

    await dashboardPage.selectLanguage('Deutsch')
    const germanHeadline = await $(`h1=Lokale Informationen`)
    await germanHeadline.waitForDisplayed({ timeout: 10000 })

    expect(await germanHeadline.isDisplayed()).toBeTruthy()
    const germanContent = await $(`*=Willkommen`)
    await germanContent.waitForDisplayed({ timeout: 10000 })
    expect(await germanContent.isDisplayed()).toBeTruthy()
  })
})
