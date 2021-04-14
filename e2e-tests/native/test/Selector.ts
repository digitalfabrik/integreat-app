
export class Selector {
    private queries: Array<string> = new Array<string>()

    public ByContainsText(text: string): Selector {
        if (driver.isAndroid) {
            this.queries.push(`.textContains("${text}")`)
        } else {
            this.queries.push(`value CONTAINS '${text}'`)
        }
        return this
    }

    public ByAccessibilityId(id: string): Selector {
        if (driver.isAndroid) {
            this.queries.push(`.description("${id}")`)
        } else {
            this.queries.push(`name EQUALS 'id'`)
        }
        return this
    }

    public build(): string {
        if (driver.isAndroid) {
            return `android=new UiSelector()${this.queries.join('')}`
        } else {
            return `-ios predicate string:${this.queries.join('')}`
        }
    }
}