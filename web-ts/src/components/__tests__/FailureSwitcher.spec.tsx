import React from 'react'
import { render } from '@testing-library/react'
import { FailureSwitcher } from '../FailureSwitcher'
import { NotFoundError } from 'api-client'
import { LOCAL_NEWS_TYPE, TU_NEWS_TYPE } from 'api-client/src/routes'
import { MemoryRouter } from 'react-router-dom'

jest.mock('react-i18next')

describe('FailureSwitcher', () => {
  const city = 'augsburg'

  const language = 'de'

  describe.each`
    type               | id
    ${'category'}      | ${'willkommen'}
    ${'event'}         | ${'1234'}
    ${LOCAL_NEWS_TYPE} | ${'/augsburg/en/news/local/1'}
    ${TU_NEWS_TYPE}    | ${'/augsburg/en/news/tu-news/1'}
    ${'offer'}         | ${'sprungbrett'}
    ${'poi'}           | ${'1234'}
  `('render $type component not found failure', ({ type, id }) => {
    it(`should render a ${type} not found failure and match snapshot`, () => {
      const error = new NotFoundError({ type, id, language, city })
      const component = FailureSwitcher.renderContentNotFoundComponent(error)
      expect(component).toMatchSnapshot()
    })

    it('should call render content not found component and create a Failure component', () => {
      const error = new NotFoundError({ type, id, language, city })
      const spy = jest.spyOn(FailureSwitcher, 'renderContentNotFoundComponent')
      const { findByText } = render(<FailureSwitcher error={error} />, { wrapper: MemoryRouter })
      expect(spy).toHaveBeenCalledWith(error)
      expect(findByText(`notFound.${type}`)).toBeTruthy()

      spy.mockRestore()
    })
  })

  it('should render a failure as default', () => {
    const errorMessage = 'error message'
    const error = new Error(errorMessage)
    const { findByText } = render(<FailureSwitcher error={error} />, { wrapper: MemoryRouter })

    expect(findByText(errorMessage)).toBeTruthy()
  })
})
