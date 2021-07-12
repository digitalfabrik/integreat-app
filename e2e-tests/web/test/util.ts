export const openLink = async (element: WebdriverIO.Element): Promise<string> => {
  const previousUrl = await browser.getUrl()
  await element.click()
  await browser.waitUntil(async () => previousUrl !== (await browser.getUrl()), {
    timeout: 10000,
    interval: 1000,
    timeoutMsg: 'Navigation timed out or element is no link.'
  })
  return browser.getUrl()
}
