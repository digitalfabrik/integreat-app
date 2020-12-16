// @flow

const defaultCaps = {
  'browserstack.user': process.env.E2E_BROWSERSTACK_USER,
  'browserstack.key': process.env.E2E_BROWSERSTACK_KEY,
  'browserstack.debug': true,
  'browserstack.local': true,
  project: 'integreat-app-web'
}

exports.local_chrome = {
  url: 'http://localhost:9000/wd/hub',
  prefix: 'IG LOCAL',
  browser: 'chrome',
  local: true
}

exports.browserstack_dev_ie11 = {
  url: 'http://hub-cloud.browserstack.com/wd/hub',
  prefix: 'IG DEV',
  browser: 'IE11',
  local: false,
  caps: {
    os: 'Windows',
    os_version: '10',
    browser: 'IE',
    browser_Version: '11.0',
    ...defaultCaps
  }
}

exports.browserstack_dev_chrome = {
  url: 'http://hub-cloud.browserstack.com/wd/hub',
  prefix: 'IG DEV',
  browser: 'chrome',
  local: false,
  caps: {
    os: 'Windows',
    os_version: '10',
    browser: 'Chrome',
    browser_Version: '80',
    ...defaultCaps
  }
}
