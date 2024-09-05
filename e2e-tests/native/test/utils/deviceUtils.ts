import { Selector } from '../helpers/Selector.js'

export const allowNotifications = async (): Promise<void> => {
  try {
    const allow = await $(new Selector().ByText('Allow').build())
    await allow.waitForDisplayed()
    allow.click()
  } catch (error) {
    console.warn('Permission request was not displayed within the timeout:', error)
  }
}
