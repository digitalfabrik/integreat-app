// @flow

const defaultCaps = {
  'browserstack.user': process.env.E2E_BROWSERSTACK_USER,
  'browserstack.key': process.env.E2E_BROWSERSTACK_KEY,
  'browserstack.debug': true,
  project: 'integreat-app-web'
}

exports.local_chrome = {
  url: 'http://localhost:4444/wd/hub',
  prefix: 'IG LOCAL',
  browser: 'Chrome',
  caps: {
    os: 'Windows',
    os_version: '10',
    browserName: 'chrome',
    browser_version: '80',
    version: '80',
    'browserstack.local': true,
    loggingPrefs: {
      driver: 'DEBUG',
      client: 'DEBUG',
      server: 'OFF',
      browser: 'OFF',
      performance: 'INFO'
    },
    ...defaultCaps
  }
}

exports.browserstack_dev_ie11 = {
  url: 'http://hub-cloud.browserstack.com/wd/hub',
  prefix: 'IG DEV',
  browser: 'IE11',
  caps: {
    os: 'Windows',
    os_version: '10',
    browserName: 'IE',
    browser_version: '11.0',
    'browserstack.local': true,
    ...defaultCaps
  }
}

exports.browserstack_dev_chrome = {
  url: 'http://hub-cloud.browserstack.com/wd/hub',
  prefix: 'IG DEV',
  browser: 'chrome',
  caps: {
    os: 'Windows',
    os_version: '10',
    browserName: 'Chrome',
    browser_version: '80',
    'browserstack.local': true,
    ...defaultCaps
  }
}
