const childProcess = require('child_process')
const defaultConfig = require('../wdio.conf')
const merge = require('deepmerge')

const getGitBranch = () => {
    return childProcess.execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
}

const getGitHeadReference = () => {
    return childProcess.execSync('git rev-parse --short HEAD').toString().trim()
}

const browserstackCaps = (config) => {
    const prefix = 'IG DEV'
    return {
        'bstack:options': {
            ...config,
            buildName: `${prefix}: ${getGitBranch()}`,
            sessionName: `${config.browserName.toLowerCase()}: ${getGitHeadReference()}`,
            local: true,
            debug: true,
            projectName: 'integreat-app-web',
        },
        browserName: config.browserName,
        acceptInsecureCerts: true
    }
}

exports.config = merge(defaultConfig.config, {
    maxInstances: 1,

    user: process.env.E2E_BROWSERSTACK_USER,
    key: process.env.E2E_BROWSERSTACK_KEY,

    capabilities: [
        browserstackCaps({
            browserVersion: '80',
            os: 'Windows',
            osVersion: '10',
            browserName: 'Chrome',
        }),
        browserstackCaps({
            os: 'Windows',
            osVersion: '10',
            browserName: 'Firefox',
            browserVersion: '84.0',
        }),
        browserstackCaps({
            os: 'OS X',
            osVersion: 'Big Sur',
            browserName: 'Safari',
            browserVersion: '14.0',
        }),
        browserstackCaps({
            os: 'Windows',
            osVersion: '10',
            browserName: 'IE',
            browserVersion: '11.0',
            ie: {
                driver: '3.141.59'
            },
            seleniumVersion: '3.141.59'
        })],

    services: [['browserstack', {browserstackLocal: true}]],
    host: 'hub.browserstack.com',
}, {
    clone: false,
    customMerge: (key) => {
        if (key === 'capabilities')
            return (c1, c2) => c2
    }
})
