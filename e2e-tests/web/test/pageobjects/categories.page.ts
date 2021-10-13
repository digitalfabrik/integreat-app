import Page from './page'

export class CategoriesPage extends Page {
  private findCategory(category: string): Promise<WebdriverIO.Element> {
    return $(`*=${category}`)
  }

  public async openCategory(category: string): Promise<void> {
    return (await this.findCategory(category)).click()
  }
}

export default new CategoriesPage()
