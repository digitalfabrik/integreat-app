export const allowNotifications = async (): Promise<void> => {
  try {
    await driver.acceptAlert()
  } catch (error) {
    console.error('Permission request was not displayed within the timeout:', error)
  }
}
