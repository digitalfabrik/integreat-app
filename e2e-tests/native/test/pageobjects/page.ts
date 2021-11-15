export class Page {
  readonly pageId

  constructor(pageId: string) {
    this.pageId = pageId
  }

  public async get(): Promise<ReturnType<typeof $>> {
    return $(`~${this.pageId}`)
  }
}
