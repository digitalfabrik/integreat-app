
export class Page {
    readonly pageId

    constructor(pageId: string) {
        this.pageId = pageId
    }

    public async exists(): Promise<boolean | void> {
        const page = await $(`~${this.pageId}`)
        return await page.waitForExist()
    }
}