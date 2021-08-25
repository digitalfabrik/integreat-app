import Page from './page'

class CategoriesPage extends Page {
  public findCategory(cat: string) {
    return $(`*=${cat}`)
  }

  public async openCategory(category: string) {
    return (await $(`*=${category}`)).click()
  }
}

export default new CategoriesPage()
