// @flow

export type SeleniumCapabilitiesType = {|
  browserName: string,
  browserVersion: string,
  platformName?: string,
  chromeOptions?: {| args: Array<string> |}
|}

export type BrowserstackCapabilitiesType = {|
  os: string,
  os_version: string,
  browserName: string,
  browser_version: string,
  'browserstack.local': boolean,
  'browserstack.user': string,
  'browserstack.key': string,
  'browserstack.debug': boolean,
  project: string
|}

export type EndToEndConfigType = {|
  url: string,
  prefix: string,
  browserstack?: boolean,
  caps: SeleniumCapabilitiesType | BrowserstackCapabilitiesType
|}

/*
  LOCAL
 */

exports.local_chrome = ({
  url: 'http://localhost:4444/wd/hub',
  prefix: 'IG LOCAL',
  caps: {
    browserName: 'chrome', // selenium has lowercased browsernames
    browserVersion: '88'
  }
}: EndToEndConfigType)

/*
  CI
 */

exports.ci_chrome = ({
  url: 'http://localhost:4444/wd/hub',
  prefix: 'IG DEV',
  caps: {
    browserName: 'chrome',
    browserVersion: '88',
    platformName: 'linux',
    chromeOptions: {
      args: [
        '--headless',
        '--window-size=800,600'
      ]
    }
  }
}: EndToEndConfigType)

/*
  DEVELOPMENT (In Browserstack)
 */

const defaultBrowserstackCaps: $Shape<BrowserstackCapabilitiesType> = {
  'browserstack.local': true,
  'browserstack.user': process.env.E2E_BROWSERSTACK_USER,
  'browserstack.key': process.env.E2E_BROWSERSTACK_KEY,
  'browserstack.debug': true,
  project: 'integreat-app-web'
}

exports.browserstack_dev_ie11 = ({
  url: 'http://hub-cloud.browserstack.com/wd/hub',
  prefix: 'IG DEV',
  browserstack: true,
  caps: {
    os: 'Windows',
    os_version: '10',
    browserName: 'IE',
    browser_version: '11.0',
    ...defaultBrowserstackCaps
  }
}: EndToEndConfigType)

exports.browserstack_dev_chrome = ({
  url: 'http://hub-cloud.browserstack.com/wd/hub',
  prefix: 'IG DEV',
  browserstack: true,
  caps: {
    os: 'Windows',
    os_version: '10',
    browserName: 'Chrome',
    browser_version: '80',
    ...defaultBrowserstackCaps
  }
}: EndToEndConfigType)

exports.browserstack_dev_firefox = ({
  url: 'http://hub-cloud.browserstack.com/wd/hub',
  prefix: 'IG DEV',
  browserstack: true,
  caps: {
    os: 'Windows',
    os_version: '10',
    browserName: 'Firefox',
    browser_version: '84.0',
    ...defaultBrowserstackCaps
  }
}: EndToEndConfigType)

exports.browserstack_dev_safari = ({
  url: 'http://hub-cloud.browserstack.com/wd/hub',
  prefix: 'IG DEV',
  browserstack: true,
  caps: {
    os: 'OS X',
    os_version: 'Big Sur',
    browserName: 'Safari',
    browser_version: '14.0',
    ...defaultBrowserstackCaps
  }
}: EndToEndConfigType)
