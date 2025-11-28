import React from 'react'

import { LOCAL_NEWS_TYPE, TU_NEWS_TYPE } from 'shared'
import { MappingError, NotFoundError, ResponseError, fromError } from 'shared/api'

import { renderWithRouterAndTheme } from '../../testing/render'
import { reportError } from '../../utils/sentry'
import FailureSwitcher from '../FailureSwitcher'

jest.mock('react-i18next')
jest.mock('../../utils/sentry', () => ({
  reportError: jest.fn(async () => undefined),
}))

describe('FailureSwitcher', () => {
  const city = 'augsburg'
  const language = 'de'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it.each`
    type               | id              | notFoundKey   | goToKey         | goToPath
    ${'category'}      | ${'willkommen'} | ${'category'} | ${'categories'} | ${'/augsburg/de'}
    ${'event'}         | ${'1234'}       | ${'event'}    | ${'events'}     | ${'/augsburg/de/events'}
    ${LOCAL_NEWS_TYPE} | ${'1'}          | ${'news'}     | ${'news'}       | ${'/augsburg/de/news/local'}
    ${TU_NEWS_TYPE}    | ${'1'}          | ${'news'}     | ${'news'}       | ${'/augsburg/de/news/tu-news'}
    ${'poi'}           | ${'1234'}       | ${'poi'}      | ${'pois'}       | ${'/augsburg/de/locations'}
  `('should render $type not found failure', ({ type, id, notFoundKey, goToKey, goToPath }) => {
    const error = new NotFoundError({ type, id, language, city })
    const { getByText } = renderWithRouterAndTheme(<FailureSwitcher error={error} />)

    expect(getByText(`error:notFound.${notFoundKey}`)).toBeTruthy()
    expect(getByText(`error:goTo.${goToKey}`).closest('a')).toHaveProperty('href', `http://localhost${goToPath}`)
    expect(reportError).toHaveBeenCalledWith(error)
  })

  it('should render a failure as default', async () => {
    const error = new Error('error message')
    const { getByText } = renderWithRouterAndTheme(<FailureSwitcher error={error} />)

    expect(getByText(`error:${fromError(error)}`)).toBeTruthy()
    expect(reportError).toHaveBeenCalledTimes(1)
    expect(reportError).toHaveBeenCalledWith(error)
  })

  it('should report mapping errors to sentry', async () => {
    const error = new MappingError('category', 'some message')
    const { getByText } = renderWithRouterAndTheme(<FailureSwitcher error={error} />)

    expect(getByText(`error:${fromError(error)}`)).toBeTruthy()
    expect(reportError).toHaveBeenCalledTimes(1)
    expect(reportError).toHaveBeenCalledWith(error)
  })

  it('should report response errors to sentry', async () => {
    const error = new ResponseError({
      endpointName: 'cities',
      response: {} as Response,
      url: 'https://example.com',
      requestOptions: { method: 'GET' },
    })
    const { getByText } = renderWithRouterAndTheme(<FailureSwitcher error={error} />)

    expect(getByText(`error:${fromError(error)}`)).toBeTruthy()
    expect(reportError).toHaveBeenCalledTimes(1)
    expect(reportError).toHaveBeenCalledWith(error)
  })
})
