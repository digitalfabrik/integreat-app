
export class Page {
    private pageId: string = ''

    constructor(pageId: string) {
        this.pageId = pageId
    }

    public async exists(): Promise<boolean | void> {
        const page = await $(`~${this.pageId}`)
        return await page.waitForExist()
    }
}