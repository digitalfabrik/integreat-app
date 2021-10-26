import * as Sentry from '@sentry/react-native'
import { times } from 'lodash'
import { mocked } from 'ts-jest/utils'

import { FetchError, NotFoundError } from 'api-client'

import buildConfig from '../../constants/buildConfig'
import AppSettings from '../AppSettings'
import { generateRouteKey, getExtension, determineApiUrl, reportError, log, initSentry } from '../helpers'

jest.mock('@sentry/react-native', () => ({
  ...jest.requireActual('@sentry/react-native'),
  captureException: jest.fn(),
  addBreadcrumb: jest.fn(),
  initSentry: jest.fn()
}))

beforeEach(() => {
  jest.clearAllMocks()
})

const mockedBuildConfig = mocked(buildConfig)
const mockBuildConfig = (sentry: boolean, developerFriendly = false) => {
  const previous = buildConfig()
  mockedBuildConfig.mockImplementation(() => ({
    ...previous,
    featureFlags: { ...previous.featureFlags, sentry, developerFriendly }
  }))
}

describe('initSentry', () => {
  it('should not call init if disabled in build config', () => {
    mockBuildConfig(false)
    initSentry()
    expect(Sentry.init).not.toHaveBeenCalled()
  })

  it('should call init if enabled in build config', () => {
    mockBuildConfig(true)
    initSentry()
    expect(Sentry.init).toHaveBeenCalledTimes(1)
  })
})

describe('reportError', () => {
  it('should not report to sentry if disabled in build config', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation()
    mockBuildConfig(false, true)
    const error = new Error('my error')
    reportError(error)
    expect(Sentry.captureException).not.toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(error)
    spy.mockRestore()
  })

  it('should not report fetch and not found errors to sentry', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation()
    mockBuildConfig(true, false)
    const error = new FetchError({ endpointName: 'my endpoint', innerError: new Error() })
    reportError(error)
    expect(Sentry.captureException).not.toHaveBeenCalled()
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()

    mockBuildConfig(true)
    const notFoundError = new NotFoundError({ type: 'category', id: 'id', city: 'city', language: 'language' })
    reportError(notFoundError)
    expect(Sentry.captureException).not.toHaveBeenCalled()
  })

  it('should report to sentry if enabled in build config', () => {
    mockBuildConfig(true)
    const error = new Error('my error')
    reportError(error)
    expect(Sentry.captureException).toHaveBeenCalledTimes(1)
    expect(Sentry.captureException).toHaveBeenCalledWith(error)
  })
})

describe('log', () => {
  it('should not report to sentry if disabled in build config', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation()
    mockBuildConfig(false, true)
    log('test log', 'warning')
    expect(Sentry.addBreadcrumb).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(warnSpy).toHaveBeenCalledWith('test log')
    warnSpy.mockRestore()

    const debugSpy = jest.spyOn(console, 'debug').mockImplementation()
    log('debug test log')
    expect(Sentry.addBreadcrumb).not.toHaveBeenCalled()
    expect(debugSpy).toHaveBeenCalledTimes(1)
    expect(debugSpy).toHaveBeenCalledWith('debug test log')
    debugSpy.mockRestore()
  })

  it('should report to sentry if enabled in build config', () => {
    mockBuildConfig(true, false)
    const errorSpy = jest.spyOn(console, 'error').mockImplementation()
    log('test error log', 'error')
    expect(Sentry.addBreadcrumb).toHaveBeenCalledTimes(1)
    expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
      message: 'test error log',
      level: Sentry.Severity.Error
    })
    expect(errorSpy).not.toHaveBeenCalled()
    errorSpy.mockRestore()

    log('test warn log', 'warning')
    expect(Sentry.addBreadcrumb).toHaveBeenCalledTimes(2)
    expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
      message: 'test warn log',
      level: Sentry.Severity.Warning
    })

    log('test log', 'log')
    expect(Sentry.addBreadcrumb).toHaveBeenCalledTimes(3)
    expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
      message: 'test log',
      level: Sentry.Severity.Log
    })

    log('test debug log')
    expect(Sentry.addBreadcrumb).toHaveBeenCalledTimes(4)
    expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
      message: 'test debug log',
      level: Sentry.Severity.Debug
    })
  })
})

describe('generateRouteKey', () => {
  it('should not generate the same key multiple times', () => {
    const keys = new Array<string>()
    times(1000, () => keys.push(generateRouteKey()))
    expect(new Set(keys).size).toBe(1000)
  })
})

describe('getExtension', () => {
  it('should return the extension of a regular file-url', () => {
    expect(getExtension('https://ex.am/p.l/thumbnail.png')).toBe('png')
  })
  it('should ignore any trailing query string', () => {
    expect(getExtension('https://ex.am/p.l/thumbnail.png?size=med')).toBe('png')
  })
  it('should ignore any trailing hash string', () => {
    expect(getExtension('https://ex.am/p.l/thumbnail.png#what-ever')).toBe('png')
  })
  it('should ignore any combined query and hash string', () => {
    expect(getExtension('https://ex.am/p.l/thumbnail.png#what-ever?this-is')).toBe('png')
    expect(getExtension('https://ex.am/p.l/thumbnail.png?what-ever#this-is')).toBe('png')
    expect(getExtension('https://ex.am/p.l#serjkd/thumbnail.png?what-ever#this-is')).toBe('l')
  })
  it('should throw if it is no valid url', () => {
    expect(() => getExtension('thumbnail')).toThrow('Invalid URL')
  })
  it('should return empty string if there is no extension', () => {
    expect(getExtension('https://ex.am/p.l/thumbnail')).toBe('')
  })
  it('should return empty string if there is no pathname', () => {
    expect(getExtension('https://ex.am/')).toBe('')
  })
})

describe('determineApiUrl', () => {
  it('should return the default baseURL if no overrideApiUrl is set', async () => {
    const apiUrl = await determineApiUrl()
    expect(apiUrl).toEqual(buildConfig().cmsUrl)
  })
  it('should return the overrideApiUrl if it is set', async () => {
    new AppSettings().setApiUrlOverride('https://super-cool-override-cms.url.com')
    const apiUrl = await determineApiUrl()
    expect(apiUrl).toEqual('https://super-cool-override-cms.url.com')
  })
})
