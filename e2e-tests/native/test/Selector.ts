export class Selector {
  private queries: Array<string> = new Array<string>()

  public ByText(text: string): Selector {
    if (driver.isAndroid) {
      this.queries.push(`.text("${text}")`)
    } else {
      this.queries.push(`label LIKE '${text}'`)
    }
    return this
  }

  public build(): string {
    if (driver.isAndroid) {
      return `android=new UiSelector()${this.queries.join('')}`
    } else {
      return `-ios predicate string:${this.queries.join(' AND ')}`
    }
  }
}
