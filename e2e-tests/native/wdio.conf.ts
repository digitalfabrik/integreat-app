import {execSync} from 'child_process'
import {Capabilities} from '@wdio/types/build/Capabilities'

const getGitBranch = () => {
    return execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
}

const getGitHeadReference = () => {
    return execSync('git rev-parse --short HEAD').toString().trim()
}

const browserstackCaps = (config: Capabilities): Capabilities => {
    const isCi = !!process.env.E2E_CI
    const prefix = isCi ? 'IG CI' : 'IG DEV'
    const app = config.platformName === 'android' ? process.env.E2E_BROWSERSTACK_APP_ANDROID : process.env.E2E_BROWSERSTACK_APP_IOS
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

    maxInstances: 1,

    capabilities: [
        {
            platformName: 'android',
            'appium:app': '../native/android/app/build/outputs/apk/debug/app-debug.apk'
        }
    ],

    logLevel: 'info',
    coloredLogs: true,
    bail: 0,
    port: 4723, // default appium port
    waitforTimeout: 100000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['appium'],
    framework: 'jasmine',
    reporters: ['junit'],

    jasmineNodeOpts: {
        defaultTimeoutInterval: 120000
    },

    onPrepare: async function (): Promise<void> {
        const startupDelay = 3000
        await new Promise(resolve => setTimeout(resolve, startupDelay))
    },
}
