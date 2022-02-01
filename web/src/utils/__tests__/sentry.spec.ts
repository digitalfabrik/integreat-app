import * as Sentry from '@sentry/react'
import { waitFor } from '@testing-library/react'

import { FetchError, NotFoundError } from 'api-client'

import buildConfig from '../../constants/buildConfig'
import { initSentry, log, reportError } from '../sentry'

jest.mock('@sentry/react', () => ({
  ...jest.requireActual('@sentry/react'),
  captureException: jest.fn(),
  addBreadcrumb: jest.fn(),
  init: jest.fn()
}))

const previousConfig = buildConfig()
let config = previousConfig

afterAll(() => {
  config = previousConfig
})

beforeEach(() => {
  jest.clearAllMocks()
})

const mockBuildConfig = (sentry: boolean, developerFriendly = false) => {
  config.featureFlags.sentry = sentry
  config.featureFlags.developerFriendly = developerFriendly
}

describe('initSentry', () => {
  it('should not call init if disabled in build config', async () => {
    mockBuildConfig(false)
    await initSentry()
    expect(Sentry.init).not.toHaveBeenCalled()
  })

  it('should call init if enabled in build config', async () => {
    mockBuildConfig(true)
    await initSentry()
    waitFor(() => expect(Sentry.init).toHaveBeenCalledTimes(1))
  })
})

describe('reportError', () => {
  it('should not report to sentry if disabled in build config', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation()
    mockBuildConfig(false, true)
    const error = new Error('my error')
    await reportError(error)
    expect(Sentry.captureException).not.toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(error)
    spy.mockRestore()
  })

  it('should not report fetch and not found errors to sentry', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation()
    mockBuildConfig(true, false)
    const error = new FetchError({
      endpointName: 'my endpoint',
      innerError: new Error(),
      url: 'https://example.com',
      requestOptions: { method: 'GET' }
    })
    await reportError(error)
    expect(Sentry.captureException).not.toHaveBeenCalled()
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()

    mockBuildConfig(true)
    const notFoundError = new NotFoundError({ type: 'category', id: 'id', city: 'city', language: 'language' })
    await reportError(notFoundError)
    expect(Sentry.captureException).not.toHaveBeenCalled()
  })

  it('should report to sentry if enabled in build config', async () => {
    mockBuildConfig(true)
    const error = new Error('my error')
    await reportError(error)
    expect(Sentry.captureException).toHaveBeenCalledTimes(1)
    expect(Sentry.captureException).toHaveBeenCalledWith(error)
  })
})

describe('log', () => {
  it('should not report to sentry if disabled in build config', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation()
    mockBuildConfig(false, true)
    await log('test log', 'warning')
    expect(Sentry.addBreadcrumb).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(warnSpy).toHaveBeenCalledWith('test log')
    warnSpy.mockRestore()

    const debugSpy = jest.spyOn(console, 'debug').mockImplementation()
    await log('debug test log')
    expect(Sentry.addBreadcrumb).not.toHaveBeenCalled()
    expect(debugSpy).toHaveBeenCalledTimes(1)
    expect(debugSpy).toHaveBeenCalledWith('debug test log')
    debugSpy.mockRestore()
  })

  it('should report to sentry if enabled in build config', async () => {
    mockBuildConfig(true, false)
    const errorSpy = jest.spyOn(console, 'error').mockImplementation()
    await log('test error log', 'error')
    expect(Sentry.addBreadcrumb).toHaveBeenCalledTimes(1)
    expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
      message: 'test error log',
      level: Sentry.Severity.Error
    })
    expect(errorSpy).not.toHaveBeenCalled()
    errorSpy.mockRestore()

    await log('test warn log', 'warning')
    expect(Sentry.addBreadcrumb).toHaveBeenCalledTimes(2)
    expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
      message: 'test warn log',
      level: Sentry.Severity.Warning
    })

    await log('test log', 'log')
    expect(Sentry.addBreadcrumb).toHaveBeenCalledTimes(3)
    expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
      message: 'test log',
      level: Sentry.Severity.Log
    })

    await log('test debug log')
    expect(Sentry.addBreadcrumb).toHaveBeenCalledTimes(4)
    expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
      message: 'test debug log',
      level: Sentry.Severity.Debug
    })
  })
})
