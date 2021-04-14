import {execSync} from 'child_process'
import {Capabilities} from '@wdio/types/build/Capabilities'

const getGitBranch = () => {
    return execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
}

const getGitHeadReference = () => {
    return execSync('git rev-parse --short HEAD').toString().trim()
}

const browserstackCaps = (config: Capabilities, platform: 'android' | 'ios'): Capabilities => {
    const isCi = !!process.env.E2E_CI
    const prefix = isCi ? 'IG CI' : 'IG DEV'
    const app = platform === 'android' ? process.env.E2E_BROWSERSTACK_APP_ANDROID : process.env.E2E_BROWSERSTACK_APP_IOS
    return {
        'bstack:options': {
            buildName: `${prefix}: ${getGitBranch()}`,
            sessionName: `${config.browserName?.toLowerCase()}: ${getGitHeadReference()}`,
            projectName: 'integreat-react-native-app',
            local: true,
            debug: true,
            realMobile: isCi,
            appiumVersion: '1.17.0'
        },
        ...config,
        "appium:app": app,
    }
}

export const config = {


    runner: 'local',
    specs: [
        './native/test/specs/**/*.ts'
    ],
    exclude: [],

    maxInstances: 2,

    user: process.env.E2E_BROWSERSTACK_USER,
    key: process.env.E2E_BROWSERSTACK_KEY,

    capabilities: [
        browserstackCaps({
            'appium:platformVersion': '9.0',
            'appium:deviceName': 'Google Pixel 3',
            'appium:automationName': 'UiAutomator2'
        }, 'android'),
        browserstackCaps({
            'appium:platformVersion': '12',
            'appium:deviceName': 'iPhone 8',
            'appium:automationName': 'XCUITest'
        }, 'ios')
    ],

    logLevel: 'info',
    coloredLogs: true,
    bail: 0,
    baseUrl: 'http://localhost:9000',
    waitforTimeout: 100000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: [['browserstack', {browserstackLocal: true}]],
    host: 'hub.browserstack.com',
    framework: 'jasmine',
    reporters: ['junit'],

    jasmineNodeOpts: {
        defaultTimeoutInterval: 120000
    },
}
