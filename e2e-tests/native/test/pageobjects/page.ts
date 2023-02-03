export class Page {
  readonly pageId

  constructor(pageId: string) {
    this.pageId = pageId
  }

  public async get(): Promise<true | void> {
    return $(`~${this.pageId}`).waitForExist()
  }
}
