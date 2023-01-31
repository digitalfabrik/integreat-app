import { Selector } from './Selector'

const WAIT_FOR_SWIPE_FINISHED = 1000

class Gestures {
  static async checkIfDisplayedWithSwipeUp(text: string, maxScrolls: number): Promise<WebdriverIO.Element> {
    if (driver.isAndroid) {
      return this.swipeIntoViewAndroid(text, maxScrolls)
    }
    return this.swipeIntoViewIOS(text, maxScrolls)
  }

  static async swipeIntoViewAndroid(text: string, maxScrolls: number, amount = 0): Promise<WebdriverIO.Element> {
    const scrollForward = `android=new UiScrollable(new UiSelector().scrollable(true)).scrollForward()`
    const element = $(new Selector().ByText(text).build())
    if (!(await element.isDisplayed()) && amount <= maxScrolls) {
      await $(scrollForward)
      await driver.pause(WAIT_FOR_SWIPE_FINISHED)
      await this.swipeIntoViewAndroid(text, maxScrolls, amount + 1)
    } else if (amount > maxScrolls) {
      // If the element is still not visible after the max amount of scroll let it fail
      throw new Error(`The element '${text}' could not be found or is not visible.`)
    }
    return element
  }

  static async swipeIntoViewIOS(text: string, maxScrolls: number, amount = 0): Promise<WebdriverIO.Element> {
    // If the element is not displayed and we haven't scrolled the max amount of scrolls
    // then scroll and execute the method again
    const element = $(`-ios predicate string:label LIKE + ${text}`)
    if (!(await element.isDisplayed()) && amount <= maxScrolls) {
      await driver.execute('mobile:swipe', { direction: 'up' })
      await driver.pause(WAIT_FOR_SWIPE_FINISHED)
      await this.swipeIntoViewIOS(text, maxScrolls, amount + 1)
    } else if (amount > maxScrolls) {
      // If the element is still not visible after the max amount of scroll let it fail
      throw new Error(`The element '${text}' could not be found or is not visible.`)
    }
    return element
  }
}

export default Gestures
