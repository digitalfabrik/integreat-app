class Keyboard {
  static hide = async (iosSendKey = '\n'): Promise<void> => {
    if (driver.isAndroid) {
      await driver.hideKeyboard()
    } else {
      await driver.sendKeys([iosSendKey])
    }
  }
}

export default Keyboard
