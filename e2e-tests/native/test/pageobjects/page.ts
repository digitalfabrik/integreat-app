export class Page {
  readonly pageId

  constructor(pageId: string) {
    this.pageId = pageId
  }

  public async exists(): Promise<boolean> {
    const page = await $(`~${this.pageId}`)
    return Boolean(await page.waitForExist())
  }
}
