import {Capabilities} from '@wdio/types/build/Capabilities'

const androidCapabilities: Capabilities = {
    platformName: 'android',
    'appium:app': '../native/android/app/build/outputs/apk/debug/app-debug.apk',
    'appium:automationName': 'UiAutomator2'
}

export const config = {
    runner: 'local',
    specs: [
        './native/test/specs/**/*.ts'
    ],
    exclude: [],

    maxInstances: 1,

    capabilities: [
        androidCapabilities
    ],

    logLevel: 'info',
    coloredLogs: true,
    bail: 0,
    port: 4723, // default appium port
    waitforTimeout: 10000,
    waitforInterval: 2000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['appium'],
    framework: 'jasmine',
    reporters: ['junit'],

    jasmineOpts: {
        defaultTimeoutInterval: 100000
    },

    before: async function (): Promise<void> {
        const startupDelay = 10000
        await new Promise(resolve => setTimeout(resolve, startupDelay))
    },
}
