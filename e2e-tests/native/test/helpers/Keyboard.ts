
class Keyboard {
    static hide = async (iosSendKeys = '\n'): Promise<void> => {
        if (driver.isAndroid) {
            await driver.hideKeyboard()
        } else {
            await driver.sendKeys([iosSendKeys])
        }
    }
}

export default Keyboard