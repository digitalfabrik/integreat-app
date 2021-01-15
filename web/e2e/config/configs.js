// @flow

const defaultCaps = {
  'browserstack.user': process.env.E2E_BROWSERSTACK_USER,
  'browserstack.key': process.env.E2E_BROWSERSTACK_KEY,
  'browserstack.debug': true,
  project: 'integreat-app-web'
}

/*
  LOCAL
 */

exports.local_chrome = {
  url: 'http://localhost:4444/wd/hub',
  prefix: 'IG LOCAL',
  browser: 'Chrome',
  caps: {
    os: 'Windows',
    os_version: '10',
    browserName: 'chrome', // selenium has lowercased browsernames
    browser_version: '80',
    version: '80', // Needed for selenium
    'browserstack.local': true,
    ...defaultCaps
  }
}

/*
  DEVELOPMENT
 */

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

exports.browserstack_dev_firefox = {
  url: 'http://hub-cloud.browserstack.com/wd/hub',
  prefix: 'IG DEV',
  browser: 'firefox',
  caps: {
    os: 'Windows',
    os_version: '10',
    browserName: 'Firefox',
    browser_version: '84.0',
    'browserstack.local': true,
    ...defaultCaps
  }
}

exports.browserstack_dev_safari = {
  url: 'http://hub-cloud.browserstack.com/wd/hub',
  prefix: 'IG DEV',
  browser: 'safari',
  caps: {
    os: 'OS X',
    os_version: 'Big Sur',
    browserName: 'Safari',
    browser_version: '14.0',
    'browserstack.local': true,
    ...defaultCaps
  }
}

/*
  CI
 */

exports.browserstack_ci_chrome = {
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

exports.browserstack_ci_safari = {
  url: 'http://hub-cloud.browserstack.com/wd/hub',
  prefix: 'IG DEV',
  browser: 'safari',
  caps: {
    os: 'OS X',
    os_version: 'Big Sur',
    browserName: 'Safari',
    browser_version: '14.0',
    'browserstack.local': true,
    ...defaultCaps
  }
}
