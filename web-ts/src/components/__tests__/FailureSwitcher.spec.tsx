import React from 'react'
import { render } from '@testing-library/react'
import FailureSwitcher from '../FailureSwitcher'
import { NotFoundError } from 'api-client'
import { LOCAL_NEWS_TYPE, TU_NEWS_TYPE } from 'api-client/src/routes'
import { MemoryRouter } from 'react-router-dom'

jest.mock('react-i18next')

describe('FailureSwitcher', () => {
  const city = 'augsburg'
  const language = 'de'

  it.each`
    type               | id                               | goToMessage                | goToPath
    ${'category'}      | ${'willkommen'}                  | ${'error:goTo.categories'} | ${'/augsburg/de'}
    ${'event'}         | ${'1234'}                        | ${'error:goTo.events'}     | ${'/augsburg/de/events'}
    ${LOCAL_NEWS_TYPE} | ${'/augsburg/en/news/local/1'}   | ${'error:goTo.localNews'}  | ${'/augsburg/de/news/local'}
    ${TU_NEWS_TYPE}    | ${'/augsburg/en/news/tu-news/1'} | ${'error:goTo.tunews'}     | ${'/augsburg/de/news/tu-news'}
    ${'offer'}         | ${'sprungbrett'}                 | ${'error:goTo.offers'}     | ${'/augsburg/de/offers'}
    ${'poi'}           | ${'1234'}                        | ${'error:goTo.pois'}       | ${'/augsburg/de/locations'}
  `('should render $type not found failure', ({ type, id, goToMessage, goToPath }) => {
    const error = new NotFoundError({ type, id, language, city })
    const { findByText, getByText } = render(<FailureSwitcher error={error} />, { wrapper: MemoryRouter })

    expect(findByText(`notFound.${type}`)).toBeTruthy()
    expect(getByText(goToMessage).closest('a')).toHaveProperty('href', `http://localhost${goToPath}`)
  })

  it('should render a failure as default', () => {
    const errorMessage = 'error message'
    const error = new Error(errorMessage)
    const { findByText } = render(<FailureSwitcher error={error} />, { wrapper: MemoryRouter })

    expect(findByText(errorMessage)).toBeTruthy()
  })
})
