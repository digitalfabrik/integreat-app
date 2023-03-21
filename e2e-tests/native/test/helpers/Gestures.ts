const WAIT_FOR_SWIPE_FINISHED = 2000

type SelectorReturn = ReturnType<typeof $>

class Gestures {
  static async checkIfDisplayedWithSwipeUp(selector: SelectorReturn, maxScrolls: number): Promise<WebdriverIO.Element> {
    if (driver.isAndroid) {
      return this.swipeIntoViewAndroid(selector, maxScrolls)
    }
    return this.swipeIntoViewIOS(selector, maxScrolls)
  }

  static async swipeIntoViewAndroid(
    selector: SelectorReturn,
    maxScrolls: number,
    amount = 0
  ): Promise<WebdriverIO.Element> {
    const scrollForward = `android=new UiScrollable(new UiSelector().scrollable(true)).scrollForward()`
    if (!(await selector.isDisplayed()) && amount <= maxScrolls) {
      await $(scrollForward)
      await driver.pause(WAIT_FOR_SWIPE_FINISHED)
      await this.swipeIntoViewAndroid(selector, maxScrolls, amount + 1)
    } else if (amount > maxScrolls) {
      // If the element is still not visible after the max amount of scroll let it fail
      throw new Error(`The element '${selector}' could not be found or is not visible.`)
    }
    return selector
  }

  static async swipeIntoViewIOS(
    selector: SelectorReturn,
    maxScrolls: number,
    amount = 0
  ): Promise<WebdriverIO.Element> {
    // If the element is not displayed and we haven't scrolled the max amount of scrolls
    // then scroll and execute the method again
    if (!(await selector.isDisplayed()) && amount <= maxScrolls) {
      await driver.execute('mobile:swipe', { direction: 'up' })
      await driver.pause(WAIT_FOR_SWIPE_FINISHED)
      await this.swipeIntoViewIOS(selector, maxScrolls, amount + 1)
    } else if (amount > maxScrolls) {
      // If the element is still not visible after the max amount of scroll let it fail
      throw new Error(`The element '${selector}' could not be found or is not visible.`)
    }
    return selector
  }
}

export default Gestures
