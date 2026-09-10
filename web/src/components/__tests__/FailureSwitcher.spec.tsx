import React from 'react'

import { fromError, MappingError, NotFoundError, ResponseError } from 'shared/api'

import { renderWithRouterAndTheme } from '../../testing/render'
import { captureError } from '../../utils/sentry'
import FailureSwitcherWithHelmet from '../FailureSwitcherWithHelmet'

jest.mock('../../utils/sentry', () => ({
  captureError: jest.fn(async () => undefined),
}))

describe('FailureSwitcher', () => {
  const region = 'augsburg'
  const language = 'de'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it.each`
    type          | id              | notFoundKey   | goToPath
    ${'category'} | ${'willkommen'} | ${'category'} | ${'/augsburg/de'}
    ${'event'}    | ${'1234'}       | ${'events'}   | ${'/augsburg/de/events'}
    ${'news'}     | ${'1'}          | ${'news'}     | ${'/augsburg/de/news'}
    ${'place'}    | ${'1234'}       | ${'places'}   | ${'/augsburg/de/places'}
  `('should render $type not found failure', ({ type, id, notFoundKey, goToPath }) => {
    const error = new NotFoundError({ type, id, language, region })
    const { getByText } = renderWithRouterAndTheme(<FailureSwitcherWithHelmet error={error} />)

    expect(getByText(notFoundKey === 'category' ? 'error:pageNotFound' : `${notFoundKey}:error.notFound`)).toBeTruthy()
    expect(getByText('common:actions.back').closest('a')).toHaveProperty('href', `http://localhost${goToPath}`)
    expect(captureError).toHaveBeenCalledWith(error)
  })

  it('should render a failure as default', async () => {
    const error = new Error('error message')
    const { getByText } = renderWithRouterAndTheme(<FailureSwitcherWithHelmet error={error} />)

    expect(getByText(`error:${fromError(error)}`)).toBeTruthy()
    expect(captureError).toHaveBeenCalledTimes(1)
    expect(captureError).toHaveBeenCalledWith(error)
  })

  it('should report mapping errors to sentry', async () => {
    const error = new MappingError('category', 'some message')
    const { getByText } = renderWithRouterAndTheme(<FailureSwitcherWithHelmet error={error} />)

    expect(getByText(`error:${fromError(error)}`)).toBeTruthy()
    expect(captureError).toHaveBeenCalledTimes(1)
    expect(captureError).toHaveBeenCalledWith(error)
  })

  it('should report response errors to sentry', async () => {
    const error = new ResponseError({
      endpointName: 'regions',
      response: {} as Response,
      url: 'https://example.com',
      requestOptions: { method: 'GET' },
    })
    const { getByText } = renderWithRouterAndTheme(<FailureSwitcherWithHelmet error={error} />)

    expect(getByText(`error:${fromError(error)}`)).toBeTruthy()
    expect(captureError).toHaveBeenCalledTimes(1)
    expect(captureError).toHaveBeenCalledWith(error)
  })
})
