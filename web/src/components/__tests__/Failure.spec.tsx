import React from 'react'

import { renderWithRouterAndTheme } from '../../testing/render'
import Failure from '../Failure'

jest.mock('react-i18next')

describe('Failure', () => {
  it('should render a simple failure and match snapshot', () => {
    const errorMessage = 'error message'
    const { getByText } = renderWithRouterAndTheme(<Failure errorMessage={errorMessage} goToPath='/' />)

    const link = getByText('error:goTo.start')
    expect(link.closest('a')).toHaveAttribute('href', '/')
    expect(getByText(`error:${errorMessage}`)).toBeTruthy()
  })

  it('should render a failure with goToPath and goToMessage and match snapshot', () => {
    const error = {
      errorMessage: 'error message',
      goToPath: '/goTo.offers',
      goToMessage: 'goTo.offers',
    }
    const { getByText } = renderWithRouterAndTheme(<Failure {...error} />)

    const link = getByText(`error:${error.goToMessage}`)
    expect(link.closest('a')).toHaveAttribute('href', error.goToPath)
    expect(getByText(`error:${error.errorMessage}`)).toBeTruthy()
  })
})
