/**
 * main page object containing all methods, selectors and functionality
 * that is shared across all page objects
 */

export default class Page {
  /**
   * Opens a sub page of the page
   * @param path path of the sub page (e.g. /path/to/page.html)
   */

  async open(path: string): Promise<string> {
    await browser.url(path)
    if ((await browser.url(path)) === undefined) {
      throw new Error('Page not found')
    }
    return browser.getUrl()
  }
}
