// @flow

exports.browserstack_dev_ie11 = {
  url: 'http://hub-cloud.browserstack.com/wd/hub',
  prefix: 'IG DEV',
  platform: 'android',
  caps: {
    'browserstack.user': process.env.E2E_BROWSERSTACK_USER,
    'browserstack.key': process.env.E2E_BROWSERSTACK_KEY,
    project: 'integreat-web-app',
    os: 'Windows',
    os_version: '10',
    browserName: 'Chrome',
    browser_Version: '80',
    app: process.env.E2E_BROWSERSTACK_APP,
    'browserstack.debug': true
  }
}
