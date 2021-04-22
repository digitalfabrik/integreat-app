export enum SwipeDirection {
    Up,
    Down
}

type SwipePoint = { x: number; y: number }

const swipeMove = (startPoint: SwipePoint, endPoint: SwipePoint): Array<{ action: string; options: unknown }> => {
    return [
        {
            action: 'press',
            options: startPoint
        },
        {
            action: 'wait',
            options: {
                ms: 200
            }
        },
        {
            action: 'moveTo',
            options: endPoint
        },
        {
            action: 'release',
            options: {}
        }
    ]
}

export const swipe = async (direction: SwipeDirection, repeat = 1, amount = 80): Promise<void> => {
    const {width, height} = await driver.getWindowSize()

    // do a vertical swipe by percentage
    const upperPercentage = 50 + amount / 2
    const lowerPercentage = 50 - amount / 2

    if (upperPercentage > height || lowerPercentage < 0) {
        throw new Error('Cannot press beyond the border of the screen.')
    }

    const anchorPercentage = 50

    let startPoint: { x: number; y: number }
    let endPoint: { x: number; y: number }

    switch (direction) {
        case SwipeDirection.Up:
            startPoint = {
                x: (width * anchorPercentage) / 100,
                y: (height * lowerPercentage) / 100
            }
            endPoint = {
                x: (width * anchorPercentage) / 100,
                y: (height * upperPercentage) / 100
            }
            break
        case SwipeDirection.Down:
            startPoint = {
                x: (width * anchorPercentage) / 100,
                y: (height * upperPercentage) / 100
            }
            endPoint = {
                x: (width * anchorPercentage) / 100,
                y: (height * lowerPercentage) / 100
            }
    }
    await driver.touchPerform([].concat(...new Array(repeat).fill(swipeMove(startPoint, endPoint))))
}

export const hideKeyboard = async (iosSendKeys='\n'): Promise<void> => {
    if (driver.isAndroid) {
        await driver.hideKeyboard()
    } else {
        await driver.sendKeys([iosSendKeys])
    }
}